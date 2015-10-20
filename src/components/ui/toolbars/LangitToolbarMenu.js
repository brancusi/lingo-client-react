import React from 'react';
import Radium from 'radium';
import Victor from 'victor';
import IconButton from 'components/ui/buttons/IconButton';

@Radium
export default class LangitToolbarMenu extends React.Component {
  static propTypes = {
    links: React.PropTypes.array.isRequired,
  }

  componentDidMount () {
    TweenMax.to(this.domNode, 0, {autoAlpha:0});
  }

  show () {
    TweenMax.to(this.domNode, 0.25, {autoAlpha:1});
  }

  hide () {
    TweenMax.to(this.domNode, 0.15, {autoAlpha:0});
  }

  render () {
    const { links } = this.props;

    const styles = {
      position: 'absolute',
      top: 0,
      left: 0
    };

    const inc = 90/(links.length-1);
    const menuItems = links
      .map((link, i) => {
        const point = new Victor(90, 0)
          .rotateDeg(inc * i)
          .normalize()
          .multiplyScalar(50);

        return (<IconButton key={`menuItem_${i}`} click={link.click} icon={link.icon} size='32' position={point}/>)
      })

    return (
      <div ref={node => this.domNode = node} style={styles}>
        {menuItems}
      </div>
    );
  }
}
