import React from 'react';
import Radium from 'radium';
import { Map } from 'immutable';
import Media from 'components/widgets/ot/streams/Media';

@Radium
export default class Manager extends React.Component {
  static propTypes = {
    session: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = { streams : new Map() };
  }

  componentDidMount () {
    this._addStreamListeners();
  }

  componentWillUnmount () {
    this._removeStreamListeners();
  }

  _addStreamListeners () {
    const { session } = this.props;
    session.on('streamCreated', e => this._processStreamCreated(e));
    session.on('streamDestroyed', e => this._processStreamDestroyed(e));
  }

  _removeStreamListeners () {
    const { session } = this.props;
    session.off('streamCreated');
    session.off('streamDestroyed');
  }

  _processStreamCreated (event) {
    const { streams } = this.state;
    const { stream, stream : { id } } = event;
    this.setState({streams: streams.set(id, stream)});
  }

  _processStreamDestroyed (event) {
    const { streams } = this.state;
    const { stream : { id } } = event;
    this.setState({streams: streams.delete(id)});
  }

  _createMediaOutlets () {
    const { session } = this.props;
    const { streams } = this.state;

    return streams
      .map((stream, key) => (<Media key={key} session={session} stream={stream} />)).toArray();
  }

  render () {
    const containerStyles = {
      display: 'flex',
      zIndex: 1000
    };

    return (
      <div style={containerStyles}>
        {this._createMediaOutlets()}
      </div>
    );
  }
}
