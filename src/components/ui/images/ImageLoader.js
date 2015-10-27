import React, { PropTypes } from 'react';
import Radium from 'radium';

@Radium
export default class ImageLoader extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
  }

  constructor (props) {
    super(props);
    this.state = { cachedImageSrc : undefined, size: {} };
  }

  componentDidMount () {
    this._loadImage();
  }

  shouldComponentUpdate (nextProps, nextState) {
    const srcChanged = nextProps.src !== this.props.src;
    const dimensionsChanged = (nextState.size.width !== this.state.size.width) || (nextState.size.height !== this.state.size.height);

    return srcChanged || dimensionsChanged;
  }

  componentDidUpdate (prevProps) {
    if ( this.props.src !== prevProps.src )this._loadImage();
  }

  _loadImage () {
    this.image = new Image();
    this.image.onload = e => {
      const width = e.path[0].width;
      const height = e.path[0].height;
      this.setState({cachedImageSrc:this.image.src, size:{width:width, height:height}});
    };

    this.image.src = this.props.src;
  }

  render () {
    const {
      width = 200,
      height = 150
    } = this.props;

    const styles = {
      width: width,
      height: height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'black'
    };

    const { cachedImageSrc, size } = this.state;

    if ( cachedImageSrc ) {
      const dimensions = size.width > size.height ? { height:height } : { width:width };

      return (
        <div style={styles}>
          <img src={cachedImageSrc} {...dimensions}/>
        </div>
      );
    } else {
      return (<div style={styles}/>);
    }
  }
}
