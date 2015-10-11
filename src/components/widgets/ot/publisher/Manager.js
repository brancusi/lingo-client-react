import React from 'react';
import Radium from 'radium';
import Media from 'components/widgets/ot/publisher/Media';

@Radium
export default class Manager extends React.Component {
  static propTypes = {
    session: React.PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = { published: false };
  }

  _toggleVideo () {
    const { published } = this.state;
    this.setState({published:!published});
  }

  _buildPublishedFragment () {
    const { session } = this.props;

    return (
      <div>
        <a className='btn' onClick={::this._toggleVideo}>
          Toggle
        </a>
        <Media session={session} />
      </div>
    )
  }

  _buildUnPublishedFragment () {
    return (
      <div>
        <a className='btn' onClick={::this._toggleVideo}>
          Toggle
        </a>
        <p>Nada</p>
      </div>
    )
  }

  render () {
    const { published } = this.state;
    return (published ? this._buildPublishedFragment() : this._buildUnPublishedFragment());
  }
}
