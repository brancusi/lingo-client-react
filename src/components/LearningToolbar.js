import React from 'react';
import Radium from 'radium';
import IconButton from 'components/ui/buttons/IconButton';

@Radium
export default class LearningToolbar extends React.Component {
  static propTypes = {
    createLangit: React.PropTypes.func.isRequired
  };

  render () {
    const { createLangit } = this.props;

    const SIZE = 50;

    const styles = {
      position: 'absolute',
      top: '35%',
      left: '100%',
      marginLeft: '-80px',
      zIndex: 1001
    }

    const uiProps = {
      icon: 'fa-plus',
      size: SIZE,
      borderRadius: '14',
      click: createLangit,
      overTween: {opacity: 0.8},
      outTween: {opacity: 1}
    }

    return (
      <div style={styles}>
        <IconButton {...uiProps}/>
      </div>
    );
  }
}
