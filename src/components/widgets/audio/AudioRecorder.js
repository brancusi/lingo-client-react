import OggRecorder from 'utils/AudioRecorder';

import React from 'react';
import Radium from 'radium';

@Radium
export default class AudioRecorder extends React.Component {
  static propTypes = {

  }

  componentDidMount () {
    this._createRecoder();
  }

  _createRecoder () {
    this.recorder = new OggRecorder();

    this.recorder.recordings
      .map(recording => {
        const promise = new Promise((res, rej) =>{
          fetch(`http://localhost:3000/aws/sign`, { method: 'post'})
            .then(response => response.json())
            .then(awsData => res({
              url:awsData.signed_url,
              path:awsData.path,
              recording:recording}))
            .catch(err => rej(err));
        });
        return Rx.Observable.fromPromise(promise);
      })
      .concatAll()
      .subscribe(({ url, path, recording })=>{
        fetch(url, { method: 'put', body: recording})
          .then(response => console.log(response, path))
          .catch(err => console.log(err));
      });

      this.recorder.initialize();
  }

  _startRecording () {
    this.recorder.record();
  }

  _stopRecording () {
    this.recorder.stop();
  }

  render () {
    const styles = {
      border: '1px solid red',
      position: 'absolute',
      minWidth: 100,
      minHeight: 100,
      zIndex: '1000',
      background: 'white'
    };

    return (
      <div style={styles}>
        Audio Recorder!
      </div>
    );
  }
}
