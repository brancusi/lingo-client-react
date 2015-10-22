import React from 'react';
import Radium from 'radium';
import IconButton from 'components/ui/buttons/IconButton';
import MenuItems from 'components/ui/toolbars/RadialToolbarMenu';
import Rx from 'rx';

@Radium
export default class LangitToolbar extends React.Component {
  static propTypes = {
    audioFunc: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    this.mouseMoves = Rx.Observable.fromEvent(this.domNode, 'mousemove');

    // this.mouseMoves
    //   .subscribe(e => console.log(e));
  }

  _showToolBar () {
    this.menuItems.show();
  }

  _registerOut () {
    // this.menuItems.hide();
    this.isHovering = false;
  }

  render () {
    const { audioFunc } = this.props;

    const styles = {
      position: 'absolute'
    };

    const links = [
      {icon:'fa-microphone', click:audioFunc},
      {icon:'fa-i-cursor', click:audioFunc},
      {icon:'fa-instagram', click:audioFunc}
    ];

    return (
      <div ref={node=>this.domNode = node} style={styles}>
        <IconButton icon='fa-plus' size={24} over={::this._showToolBar} />
        <MenuItems links={links} ref={comp => this.menuItems = comp} />
      </div>
    );
  }
}
