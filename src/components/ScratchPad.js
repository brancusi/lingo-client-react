import React from 'react';
import Radium from 'radium';
import Langit from 'components/Langit';

@Radium
export default class ScratchPad extends React.Component {
  static propTypes = {
    scratchPad: React.PropTypes.object.isRequired
  }

  render () {
    const styles = {
      padding: '5px'
    };

    const { scratchPad } = this.props;

    const itemList = scratchPad.map(item=>{
      switch (item.type) {
      case 'Langit' :
        return (<Langit model={item}/>);

      default:
        return (<Langit model={item}/>);
      }
    }).toArray();

    return (
      <div style={styles}>
        <p>Hi from ScratchPad</p>
        <ol>
          {itemList}
        </ol>
      </div>
    );
  }
}
