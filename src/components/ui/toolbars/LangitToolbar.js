import React from 'react';
import Radium from 'radium';
import IconButton from 'components/ui/buttons/IconButton';
import MenuItems from 'components/ui/toolbars/LangitToolbarMenu';
import Rx from 'rx';

@Radium
export default class LangitToolbar extends React.Component {
  static propTypes = {

  }

  componentDidMount () {
    this.mouseMoves = Rx.Observable.fromEvent(this.domNode, 'mousemove');

    this.mouseMoves
      .subscribe(e => console.log(e));
  }

  _showToolBar () {
    this.menuItems.show();
  }

  _registerOut () {
    // this.menuItems.hide();
    this.isHovering = false;
  }

  _newAudio () {

  }

  render () {
    const styles = {
      position: 'absolute'
    };

    const links = [
      {icon:'fa-microphone', clicked:this._newAudio},
      {icon:'fa-i-cursor', clicked:this._newAudio},
      {icon:'fa-instagram', clicked:this._newAudio}
    ];

    return (
      <div ref={node=>this.domNode = node} style={styles}>
        <IconButton icon='fa-plus' size='24' over={::this._showToolBar} />
        <MenuItems links={links} ref={comp => this.menuItems = comp} />
      </div>
    );
  }
}
