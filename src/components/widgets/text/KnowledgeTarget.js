import React from 'react';
import Radium from 'radium';
import Rx from 'rx';
import LangitToolbar from 'components/ui/toolbars/LangitToolbar';

@Radium
export default class KnowledgeTarget extends React.Component {
  static propTypes = {
    langitId: React.PropTypes.string.isRequired,
    audioFunc: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    const { aceContainer } = this.refs;
    const { langitId } = this.props;

    const fbBaseUrl = 'https://lingoapp.firebaseio.com/langits/';
    const fbRef = `${fbBaseUrl}${langitId}/target/colab`;
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
    const { audioFunc } = this.props;

    const styles = {

      '@media (max-width: 1100px)': {
        width: '200px'
      },

      '@media (min-width: 1100px)': {
        width: '400px'
      },

      '@media (min-width: 1800px)': {
        width: '500px'
      },

      margin: 'auto',
      paddingTop: 80,
      paddingRight: 50,
      paddingBottom: 80,
      paddingLeft: 50,
      zIndex: 1000,
      border: '8px solid #DADADA',
      background: '#FBFDFF',
      borderRadius: 12
    };

    const aceStyles = {
      width: '100%',
      minHeight: '1.3em',
      background: '#FBFDFF'
    };

    const toolBarContainerStyles = {
      position: 'relative',
      left: '100%',
      marginLeft: 50,
      top: 80
    }

    return (
      <div style={styles}>
        <div ref='aceContainer' style={aceStyles}></div>
        <div ref='toolBarContainer' style={toolBarContainerStyles}>
          <LangitToolbar audioFunc={audioFunc}/>
        </div>
      </div>
    );
  }
}
