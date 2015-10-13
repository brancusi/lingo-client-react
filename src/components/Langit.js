import React from 'react';
import Radium from 'radium';
import Recorder from 'opus-recorder';

@Radium
export default class Langit extends React.Component {
  static propTypes = {
    model: React.PropTypes.object.isRequired
  }

  componentDidMount () {
    const { aceContainer } = this.refs;
    const { model: { id } } = this.props;

    const fbBaseUrl = 'https://lingoapp.firebaseio.com/langits/';
    const fbRef = `${fbBaseUrl}${id}/colab`;
    const firepadRef = new Firebase(fbRef);

    const editor = ace.edit(aceContainer);
    editor.setTheme('ace/theme/textmate');
    editor.setOptions({
      maxLines:100,
      fontSize:36,
      showPrintMargin:false,
      showGutter:false,
      highlightActiveLine:false
    });

    const session = editor.getSession();
    session.setUseWrapMode(true);
    session.setUseWorker(false);
    session.setMode('ace/mode/text');

    Firepad.fromACE(firepadRef, editor, {
      defaultText: ''
    });

    editor.focus();

    const mediaConstraints = { audio: true };

    navigator.getUserMedia(mediaConstraints, stream => {
      this.recorder = new MediaStreamRecorder(stream);
      this.recorder.mimeType = 'audio/ogg';
      this.recorder.audioChannels = 1;
    }, e => console.log(e));

  }

  _startRecording () {
    this.recorder.start();
  }

  _stopRecording () {
    this.recorder.stop();
    this.recorder.save();
  }

  render () {
    const styles = {
      marginBottom: '20px',
      padding: '1em',
      minWidth: '50%',
      width: '50%',
      minHeight: '5em'
    };

    const aceStyles = {
      width: '100%',
      height: '100%'
    };

    const { model: { id } } = this.props;

    return (
      <div style={styles}>
        <h4>{id}</h4>
        <div ref="aceContainer" style={aceStyles}></div>
        <a className='btn' onClick={::this._startRecording}>Start</a>
        <a className='btn' onClick={::this._stopRecording}>Stop</a>
      </div>
    );
  }
}
