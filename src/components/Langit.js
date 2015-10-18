import React from 'react';
import ReactDOM from 'react-dom';

import Radium from 'radium';
import plumb from 'imports?this=>window!script!../../node_modules/jsplumb/dist/js/jsPlumb-2.0.3-min.js';

import SoundByte from 'components/widgets/audio/SoundByte';
import AudioRecorder from 'components/widgets/audio/AudioRecorder';

import KnowledgeTarget from 'components/widgets/text/KnowledgeTarget';

import Victor from 'victor';

import { aabbLine } from 'utils/geom';

@Radium
export default class Langit extends React.Component {
  static propTypes = {
    model: React.PropTypes.object.isRequired
  }

  componentDidMount () {
    this._createLines();
  }

  _createLines () {
    const { knowledgeTarget, plumbContainer } = this.refs;
    const instance = jsPlumb.getInstance({Container: plumbContainer});
    const targetDomNode = ReactDOM.findDOMNode(knowledgeTarget);

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
          target:targetDomNode
        });

        const inc = degInc * index;
        const angleVec = new Victor(100, 100)
          .rotateDeg(inc)
          .normalize();

        const outsidePoint = angleVec.clone()
          .multiplyScalar(10000);

        const elWidth = targetDomNode.offsetWidth;
        const elHeight = targetDomNode.offsetHeight;
        const elX = targetDomNode.offsetLeft;
        const elY = targetDomNode.offsetTop;

        const centerX = elX + elWidth/2;
        const centerY = elY + elHeight/2;

        const boxPoint = aabbLine(outsidePoint.x, outsidePoint.y, -30, -30, elWidth+30, elHeight+30);
        const boxVec = new Victor(boxPoint.x, boxPoint.y);
        const distance = new Victor(elWidth/2, elHeight/2).distance(boxVec);
        const min = 20;
        const max = 80;
        const mag = Math.floor(Math.random() * ((min-max)+1) + max);
        const destVec = angleVec.clone()
          .multiplyScalar(distance + mag);

        const targetX = (destVec.x + centerX);
        const targetY = (destVec.y + centerY);

        TweenMax.to(domNode, 1, {left:targetX, top:targetY, ease:Elastic.easeOut, onUpdate:()=>{
          instance.repaintEverything();
        }});

      })
  }

  render () {
    const styles = {
      minWidth: '100%',
      position: 'relative',
      display: 'flex',
    };

    const { model: { id } } = this.props;

    const widgets = [];
    this.widgetRefs = [];
    const count = 0;
    for(let i = 0; i < count; i++){
      let ref = `widget_${i}`;
      this.widgetRefs.push(ref);
      let el = (<SoundByte key={ref} ref={ref}/>);
      widgets.push(el);
    }

    return (
      <div ref='plumbContainer' style={styles}>
        <KnowledgeTarget ref='knowledgeTarget' langitId={id} />
        {widgets}
      </div>
    );
  }
}
