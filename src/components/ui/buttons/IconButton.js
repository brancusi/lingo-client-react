import React from 'react';
import Radium from 'radium';

@Radium
export default class IconButton extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    size: React.PropTypes.string.isRequired,
    border: React.PropTypes.string,
    borderRadius: React.PropTypes.string,
    position: React.PropTypes.object,
    over: React.PropTypes.func,
    out: React.PropTypes.func,
    click: React.PropTypes.func,
    overTween: React.PropTypes.object,
    outTween: React.PropTypes.object
  }

  _mouseOver () {
    const { over = ()=>{}, overTween = {scaleX:1.2, scaleY:1.2} } = this.props;
    TweenMax.to(this.domNode, 0.15, overTween);
    over();
  }

  _mouseOut () {
    const { out = ()=>{}, outTween = {scaleX:1, scaleY:1} } = this.props;
    TweenMax.to(this.domNode, 0.15, outTween);
    out();
  }

  _clicked () {
    const { click = ()=>{}, clickTween = {scaleX:1, scaleY:1, repeat:1, yoyo:true} } = this.props;
    TweenMax.to(this.domNode, 0.05, clickTween);
    click();
  }

  render () {
    const {
      icon,
      size,
      position,
      background = '#F4F9FF',
      color = '#929292',
      borderRadius = '50%',
      border = '2px solid #A7A7A7'
    } = this.props;

    const x = position ? position.x : 0;
    const y = position ? position.y : 0;

    const styles = {
      marginLeft: -size/2,
      marginTop: -size/2,
      position: 'absolute',
      border: border,
      borderRadius: borderRadius,
      background: background,
      color: color,
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      fontSize: (size/2)-2,
      left: x,
      top: y
    };

    const iconStyles = {
      pointerEvents:'none'
    };

    return (
      <div
        ref={node=>this.domNode = node}
        style={styles}
        onMouseOver={::this._mouseOver}
        onMouseOut={::this._mouseOut}
        onClick={::this._clicked}>

        <i className={`fa ${icon}`} style={iconStyles}></i>
      </div>
    );
  }
}
