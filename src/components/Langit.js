import React from 'react';
import ReactDOM from 'react-dom';

import Radium from 'radium';
import Rx from 'rx';
import plumb from 'imports?this=>window!script!../../node_modules/jsplumb/dist/js/jsPlumb-2.0.3-min.js';

import SoundByte from 'components/widgets/audio/SoundByte';
import AudioRecorder from 'components/widgets/audio/AudioRecorder';

import Victor from 'victor';

import { aabbLine } from 'utils/geom';

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

    this._createLines();
  }

  _createLines () {
    const { sat, aceContainer, plumbContainer } = this.refs;
    const instance = jsPlumb.getInstance({Container: plumbContainer});

    instance.importDefaults({
      Connector : [ "Straight" ],
      Anchors : [ "Center", "Center" ],
      Endpoints: ['Blank', 'Blank']
    });

    const degInc = 360/this.widgetRefs.length;

    this.widgetRefs
      .map((ref, index) => {
        const domNode = ReactDOM.findDOMNode(this.refs[ref]);
        instance.connect({
          source:domNode,
          target:aceContainer
        });

        const inc = degInc * index;
        const angleVec = new Victor(100, 100)
          .rotateDeg(inc)
          .normalize();

        const outsidePoint = angleVec.clone()
          .multiplyScalar(10000);

        const elWidth = aceContainer.offsetWidth;
        const elHeight = aceContainer.offsetHeight;

        const boxPoint = aabbLine(outsidePoint.x, outsidePoint.y, -30, -30, elWidth+30, elHeight+30);
        const boxVec = new Victor(boxPoint.x, boxPoint.y);
        const distance = new Victor(elWidth/2, elHeight/2).distance(boxVec);
        const min = 100;
        const max = 200;
        const mag = Math.floor(Math.random() * ((min-max)+1) + max);
        const destVec = angleVec.clone()
          .multiplyScalar(distance + mag);

        const targetX = (destVec.x + elWidth/2) - (domNode.offsetWidth/2);
        const targetY = (destVec.y + elHeight/2) - (domNode.offsetHeight/2);

        TweenMax.to(domNode, 1, {left:targetX, top:targetY, ease:Elastic.easeOut, onUpdate:()=>{
          instance.repaintEverything();
        }});

      })
  }

  render () {
    const styles = {
      marginBottom: '20px',
      marginTop: 300,
      padding: '1em',
      minHeight: '30vh',
      position: 'relative',

      '@media (max-width: 1100px)': {
        width: '60%'
      },

      '@media (min-width: 1100px)': {
        width: '40%'
      },

      '@media (min-width: 1800px)': {
        width: '30%'
      }
    };

    const aceStyles = {
      width: '100%',
      height: '100%',
      zIndex: '100'
    };

    const { model: { id } } = this.props;

    const widgets = [];
    this.widgetRefs = [];
    const count = Math.floor(Math.random() * ((1-6)+1) + 6);
    for(let i = 0; i < parseInt(count); i++){
      let ref = `widget_${i}`;
      this.widgetRefs.push(ref);
      let el = (<SoundByte id={i} ref={ref}/>);
      widgets.push(el);
    }

    return (
      <div ref='plumbContainer' style={styles}>
        <div ref='aceContainer' style={aceStyles}></div>
        {widgets}
      </div>
    );
  }
}
