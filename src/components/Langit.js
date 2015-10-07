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
    editor.setOptions({
			maxLines:100,
			fontSize:36,
			showPrintMargin:false,
			showGutter:false,
			highlightActiveLine:false
		});

    const session = editor.getSession();
    session.setUseWrapMode(true);
    session.setUseWorker(false);
    session.setMode('ace/mode/text');

    Firepad.fromACE(firepadRef, editor, {
      defaultText: ''
    });

    editor.focus();
  }

  render () {
    const styles = {
      minHeight: '3em',
      marginBottom: '20px',
      padding: '1em'
    };

    const aceStyles = {
      width: '100%',
      height: '100%'
    };

    return (
      <div className='row'>
        <div className='col-sm-6 col-sm-offset-3 card' style={styles}>
          <div ref="aceContainer" style={aceStyles}></div>
        </div>
      </div>
    );
  }
}
