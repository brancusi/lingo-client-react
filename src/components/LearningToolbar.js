import React from 'react';
import Radium from 'radium';

@Radium
export default class LearningToolbar extends React.Component {
  static propTypes = {
    createLangit: React.PropTypes.func.isRequired
  };

  render () {
    const { createLangit } = this.props;
    const styles = {
      padding: '5px',
      border: '1px solid blue'
    };

    return (
      <div style={styles}>
        <p>Hi from Learning Tool Bar</p>
        <button className='btn btn-default'
                          onClick={createLangit}>
                  Create a langit!
                </button>
      </div>
    );
  }
}
