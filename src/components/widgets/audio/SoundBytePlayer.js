import React, { PropTypes } from 'react';
import Radium from 'radium';
import IconButton from 'components/ui/buttons/IconButton';
import AudioRecorder from 'utils/AudioRecorder';

@Radium
export default class SoundBytePlayer extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    size: PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = {playing: false, loading:false, hasRecording:false };
  }

  componentDidMount () {
    this._checkUpdate();
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { data = {}} = this.props;
    const nextData = nextProps.data || {};
    const propsChanged = (data.guid !== nextData.guid);

    const { playing, loading, hasRecording } = this.state;
    const nextPlaying = nextState.playing || false;
    const nextLoading = nextState.loading || false;
    const nextHasRecording = nextState.hasRecording || false;

    const stateChanged = (playing !== nextPlaying || loading !== nextLoading || hasRecording !== nextHasRecording);

    return (propsChanged || stateChanged);
  }

  componentDidUpdate (prevProps, prevState) {
    this._checkUpdate(prevProps);
  }

  _checkUpdate (prevProps = {}) {
    const { data = {} } = this.props;
    const prevData = prevProps.data || {};

    console.log('hey', data, prevData);
    if (data.guid !== prevData.guid) {
      this._updateSound(data);
    }
  }

  _updateSound (data) {
    const { guid, blob } = data;

    if (blob !== undefined) {
      this.audioBuffer = null;
      this.setState({loading:true, hasRecording:false});

      AudioRecorder.getInstance()
        .createBufferSource(blob)
        .then(({ buffer }) => {
          this.audioBuffer = buffer;
          this.setState({loading:false, hasRecording:true});
        });
    } else {
      this.audioBuffer = null;
      this.setState({loading:false, hasRecording:false});
    }
  }

  toggle () {
    const { playing } = this.state;

    if (playing) {
      this.audioNode.stop();
      this.audioNode = null;
      this.setState({playing: false});
    } else {
      const ctx = AudioRecorder.getInstance().audioContext;
      this.audioNode = ctx.createBufferSource();
      this.audioNode.buffer = this.audioBuffer;
      this.audioNode.connect(ctx.destination);

      this.audioNode.onended = ()=>this.setState({playing: false});
      this.audioNode.start();

      this.setState({playing: true});
    }

  }

  render () {
    const { playing, loading, hasRecording } = this.state;
    const { size } = this.props;

    const disabled = !hasRecording;

    const uiProps = {
      icon: (playing) ? 'fa-stop' : 'fa-play',
      iconOffset: (playing) ? {x:0, y:0} : {x:5, y:0},
      size:size,
      background:'#595959',
      color:'white',
      border:'0',
      click:(::this.toggle),
      disabled: disabled,
      loading: loading
    };

    console.log('uiProps', uiProps);

    return (
      <div>
        <IconButton {...uiProps} />
      </div>
    );
  }
}
