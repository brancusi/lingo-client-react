import React from 'react';
import Radium from 'radium';
import LangitToolbar from 'components/ui/toolbars/LangitToolbar';

@Radium
export default class KnowledgeTarget extends React.Component {
  static propTypes = {
    langitId: React.PropTypes.string.isRequired,
    audioFunc: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    this._createPad();
  }

  _createPad () {
    const { langitId } = this.props;

    const fbBaseUrl = 'https://saysss.firebaseio.com/langits/';
    const fbRef = `${fbBaseUrl}${langitId}/target/colab`;
    const firepadRef = new Firebase(fbRef);

    this.editor = ace.edit(this.aceContainer);
    this.editor.setTheme('ace/theme/textmate');
    this.editor.setOptions({
      maxLines:100,
      fontSize:24,
      showPrintMargin:false,
      showGutter:false,
      highlightActiveLine:false
    });

    this.session = this.editor.getSession();
    this.session.setUseWrapMode(true);
    this.session.setWrapLimitRange();
    this.session.setUseWorker(false);
    this.session.setMode('ace/mode/plain_text');

    this.editor.on('change', ::this._changeHandler);
    this._updatePlaceHolder();

    Firepad.fromACE(firepadRef, this.editor, {
      defaultText: ''
    });

    this.editor.focus();
  }

  _changeHandler () {
    this._updatePlaceHolder();
  }

  _updatePlaceHolder () {
    const value = this.session.getValue();
    if ( value && this.placeHolder ) {
      this.editor.renderer.scroller.removeChild(this.placeHolder);
      this.placeHolder = this.editor.renderer.emptyMessageNode = null;
    } else if ( !value && !this.placeHolder ) {
      this.placeHolder = this.editor.renderer.emptyMessageNode = document.createElement('div');
      this.placeHolder.textContent = 'Start typing...';
      this.placeHolder.className = 'ace_invisible';
      this.placeHolder.style.padding = '0 5px';
      this.editor.renderer.scroller.appendChild(this.placeHolder);
    }
  }

  render () {
    const { audioFunc } = this.props;

    const styles = {
      '@media (max-width: 1100px)': {
        width: '50vw'
      },
      '@media (min-width: 1100px)': {
        width: '40vw'
      },
      margin: 'auto',
      paddingTop: 80,
      paddingRight: 50,
      paddingBottom: 80,
      paddingLeft: 50,
      zIndex: 1000,
      border: '8px solid #DADADA',
      background: '#FBFDFF',
      borderRadius: '12',
      pointerEvents:'auto'
    };

    const aceStyles = {
      width: '100%',
      minHeight: '1.3em',
      background: '#FBFDFF'
    };

    const toolBarContainerStyles = {
      position: 'relative',
      left: '100%',
      marginLeft: 40,
      top: 70
    };

    return (
      <div style={styles}>
        <div ref={node => this.aceContainer = node} style={aceStyles}></div>
        <div style={toolBarContainerStyles}>
          <LangitToolbar audioFunc={audioFunc}/>
        </div>
      </div>
    );
  }
}
