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
      marginTop: '4em'
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
      <div className='col-sm-12' style={styles}>
        <div className='row'>
          <div className='col-sm-12'>
            {itemList}
          </div>
        </div>
      </div>
    );
  }
}
