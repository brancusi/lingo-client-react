import React from 'react';
import Radium from 'radium';

@Radium
export default class Langit extends React.Component {
  static propTypes = {
    model: React.PropTypes.object.isRequired
  }

  componentDidMount () {
    const { aceContainer } = this.refs;
    const { model: { id } } = this.props;

    const fbBaseUrl = 'https://lingoapp.firebaseio.com/langits/';
    const fbRef = `${fbBaseUrl}${id}/colab`;
    const firepadRef = new Firebase(fbRef);

    const editor = ace.edit(aceContainer);
    editor.setTheme('ace/theme/textmate');
    const session = editor.getSession();
    session.setUseWrapMode(true);
    session.setUseWorker(false);
    session.setMode('ace/mode/javascript');

    Firepad.fromACE(firepadRef, editor, {
      defaultText: ''
    });
  }

  render () {
    const styles = {
      height: '200px',
      border: '3px dashed grey',
      marginBottom: '20px'
    };

    const aceStyles = {
      width: '100%',
      height: '100%'
    };

    return (
      <div className='row'>
        <div className='col-sm-6 col-sm-offset-3' style={styles}>
          <div ref="aceContainer" style={aceStyles}></div>
        </div>
      </div>
    );
  }
}
