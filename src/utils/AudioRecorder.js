import Rx from 'rx';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

const OpusEncoderWorker = require("worker!./opus/workers/oggopusEncoder.js");

export default class AudioRecorder {

  constructor ( config = {} ) {
    this.audioContext = new window.AudioContext();
    this._createConfig(config);
    this._createRxStreams();
    this.state = "inactive";
    this.createAudioNodes();
  }

  _createConfig ( config ) {
    this.config = {};
    this.config.bufferLength = config.bufferLength || 4096;
    this.config.monitorGain = config.monitorGain || 0;
    this.config.numberOfChannels = config.numberOfChannels || 1;
    this.config.originalSampleRate = this.audioContext.sampleRate;
    this.config.encoderSampleRate = config.encoderSampleRate || 48000;
    this.config.leaveStreamOpen = config.leaveStreamOpen || false;
    this.config.maxBuffersPerPage = config.maxBuffersPerPage || 40;
    this.config.encoderApplication = config.encoderApplication || 2049;
    this.config.encoderFrameSize = config.encoderFrameSize || 20;
    this.config.streamOptions = config.streamOptions || {
      optional: [],
      mandatory: {
        googEchoCancellation: false,
        googAutoGainControl: false,
        googNoiseSuppression: false,
        googHighpassFilter: false
      }
    };
  }

  _createRxStreams () {
    this.recordings = new Rx.Subject();
    this.states = new Rx.Subject();
  }

  _dispatchState ( state ) {
    this.states.onNext(state);
  }

  _dispatchRecording ( blob ) {
    this.recordings.onNext(blob);
  }

  clearStream () {
    if ( this.stream ) {
      this.stream.stop();
      delete this.stream;
    }
  }

  createAudioNodes () {
    const {bufferLength, numberOfChannels, monitorGain, sampleRate} = this.config;

    this.nodeProcessor = this.audioContext.createScriptProcessor( bufferLength, numberOfChannels, numberOfChannels );
    this.nodeProcessor.onaudioprocess = e => {
      this.encodeBuffers( e.inputBuffer );
    };

    this.monitorNode = this.audioContext.createGain();
    this.setMonitorGain( monitorGain );

    if ( sampleRate < this.audioContext.sampleRate ) {
      this.createButterworthFilter();
    }
  }

  createButterworthFilter () {
    this.filterNode = this.audioContext.createBiquadFilter();
    this.filterNode2 = this.audioContext.createBiquadFilter();
    this.filterNode3 = this.audioContext.createBiquadFilter();
    this.filterNode.type = this.filterNode2.type = this.filterNode3.type = "lowpass";

    var nyquistFreq = this.config.sampleRate / 2;
    this.filterNode.frequency.value = this.filterNode2.frequency.value = this.filterNode3.frequency.value = nyquistFreq - ( nyquistFreq / 3.5355 );
    this.filterNode.Q.value = 0.51764;
    this.filterNode2.Q.value = 0.70711;
    this.filterNode3.Q.value = 1.93184;

    this.filterNode.connect( this.filterNode2 );
    this.filterNode2.connect( this.filterNode3 );
    this.filterNode3.connect( this.nodeProcessor );
  }

  encodeBuffers ( inputBuffer ) {
    if ( this.state === "recording" ) {
      var buffers = [];
      for ( var i = 0; i < inputBuffer.numberOfChannels; i++ ) {
        buffers[i] = inputBuffer.getChannelData(i);
      }

      this.encoder.postMessage({ command: "encode", buffers: buffers });
    }
  }

  initialize () {
    if ( this.stream ) {
      return;
    }

    navigator.getUserMedia(
      { audio : this.config.streamOptions },
      stream => {
        this.stream = stream;
        this.sourceNode = this.audioContext.createMediaStreamSource( stream );
        this.sourceNode.connect( this.filterNode || this.nodeProcessor );
        this.sourceNode.connect( this.monitorNode );
        this._dispatchState('streamReady');
      },
      e => this._dispatchState('streamError', { msg: e })
    );
  }

  setMonitorGain ( gain ) {
    this.monitorNode.gain.value = gain;
  }

  record () {
    if ( this.state === "inactive" && this.stream ) {
      var that = this;

      this.encoder = new OpusEncoderWorker();

      this.recordedPages = [];
      this.totalLength = 0;
      this.encoder.addEventListener( "message", e => {
        this.storePage( e.data );
      });

      // First buffer can contain old data. Don't encode it.
      this.encodeBuffers = function(){
        delete this.encodeBuffers;
      };

      this.state = "recording";
      this.monitorNode.connect( this.audioContext.destination );
      this.nodeProcessor.connect( this.audioContext.destination );

      this.encoder.postMessage( { command: "init", config: this.config } );

      this._dispatchState('recording');
    }
  }

  stop () {
    if ( this.state !== "inactive" ) {
      this.state = "inactive";
      this.monitorNode.disconnect();
      this.nodeProcessor.disconnect();

      // if ( !this.config.leaveStreamOpen ) {
      //   this.clearStream();
      // }

      this.encoder.postMessage({ command: "done" });
    }
  }

  storePage ( page ) {
    this.recordedPages.push( page );
    this.totalLength += page.length;

    // Stream is finished
    if ( page[5] & 4 ) {
      var outputData = new Uint8Array( this.totalLength );
      var outputIndex = 0;

      for ( var i = 0; i < this.recordedPages.length; i++ ) {
        outputData.set( this.recordedPages[i], outputIndex );
        outputIndex += this.recordedPages[i].length;
      }

      this.recordedPages = [];

      this._dispatchRecording(new Blob( [outputData], { type: "audio/ogg" } ));

      this._dispatchState('completed');
    }
  }

}
