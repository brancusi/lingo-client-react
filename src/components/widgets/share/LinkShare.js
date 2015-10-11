import React from 'react';
import Radium from 'radium';
import Clipboard from 'clipboard';

@Radium
export default class LinkShare extends React.Component {
  static propTypes = {
    link: React.PropTypes.string.isRequired
  }

  componentDidMount () {
    this.clipboard = new Clipboard('.shareLink');
  }

  componentWillUnmount () {
    this.clipboard.destroy();
  }

  render () {
    const { link } = this.props;

    return (
      <button className='shareLink' data-clipboard-text={link}>
          Share link
      </button>
    );
  }
}
