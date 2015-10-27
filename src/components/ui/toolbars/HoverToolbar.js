import React from 'react';
import Radium from 'radium';
import Rx from 'rx';

@Radium
export default class HoverToolbar extends React.Component {
  static propTypes = {
    children: React.PropTypes.array.isRequired,
    options: React.PropTypes.object
  }

  constructor (props) {
    super(props);
    this.state = { show:false };
  }

  componentDidMount () {
    this.overs = Rx.Observable.fromEvent(this.trigger, 'mouseover');
    this.outs = Rx.Observable.fromEvent(this.trigger, 'mouseout');

    this.oversSub = this.overs.subscribe(() => this._show());
    this.outsSub = this.outs.subscribe(() => this._hide());
  }

  componentWillUnmount () {
    this.oversSub.dispose();
    this.outsSub.dispose();
  }

  _show () {
    TweenMax.to(this.uiContainer, 0.25, {
      marginTop: 0,
      ease: Expo.easeOut
    });
  }

  _hide () {
    const height = this.uiContainer.offsetHeight;
    TweenMax.to(this.uiContainer, 0.25, {
      marginTop: -height,
      ease: Expo.easeOut
    });
  }

  render () {
    const { options = {}, children } = this.props;
    const {
      background = 'white',
      width = '100%',
      height = '100%'
    } = options;

    const styles = {
      minWidth: width,
      minHeight: height,
      overflow: 'hidden'
    };

    const uiContainer = {
      display: 'flex',
      justifyContent: 'space-between',
      background: background,
      padding: 10,
      marginTop: -100
    };

    return (
      <div ref={node => this.trigger = node} style={styles}>
        <div ref={node => this.uiContainer = node} style={uiContainer}>
          {children}
        </div>
      </div>
    );
  }
}
