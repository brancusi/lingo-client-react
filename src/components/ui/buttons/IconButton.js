import React, { PropTypes } from 'react';
import Radium from 'radium';

@Radium
export default class IconButton extends React.Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    border: PropTypes.string,
    borderRadius: PropTypes.string,
    position: PropTypes.object,
    over: PropTypes.func,
    out: PropTypes.func,
    click: PropTypes.func,
    overTween: PropTypes.object,
    outTween: PropTypes.object,
    disabled: PropTypes.bool,
    loading: PropTypes.bool
  }

  componentDidMount () {
    this._animateState();
  }

  componentDidUpdate () {
    this._animateState();
  }

  _animateState () {
    const { loading, disabled } = this.props;
    if(loading) {
      TweenMax.to(this.iconNode, 0.5, {rotation:360, repeat:-1});
    }else{
      TweenMax.to(this.iconNode, 0.25, {rotation:0});
    }

    if(disabled) {
      TweenMax.to(this.domNode, 0.25, {opacity:0.25});
    }else{
      TweenMax.to(this.domNode, 0.25, {opacity:1});
    }
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
      border = '2px solid #A7A7A7',
      loading = false
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
      top: y,
      cursor: 'pointer'
    };

    const iconStyles = {
      pointerEvents:'none'
    };

    const finalIcon = loading ? 'fa-spinner' : icon;

    return (
      <div
        ref={node=>this.domNode = node}
        style={styles}
        onMouseOver={::this._mouseOver}
        onMouseOut={::this._mouseOut}
        onClick={::this._clicked}>

        <i ref={node => this.iconNode = node} className={`fa ${finalIcon}`} style={iconStyles}></i>
      </div>
    );
  }
}
