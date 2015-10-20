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
    this._createPlubInstance();
    this._positionElements();
  }

  componentDidUpdate () {
    this._positionElements();
  }

  _showAudioRecorder () {
    this.setState({showAudioRecorder:true});
  }

  _createPlubInstance () {
    const { plumbContainer } = this.refs;
    this.plumbInstance = jsPlumb.getInstance({Container: plumbContainer});
    this.plumbInstance.importDefaults({
      Connector : [ "Straight" ],
      Anchors : [ "Center", "Center" ],
      Endpoints: ['Blank', 'Blank']
    });
  }

  _positionElements () {
    const { knowledgeTarget } = this.refs;
    const { showAudioRecorder } = this.state;
    const targetDomNode = ReactDOM.findDOMNode(knowledgeTarget);

    const elWidth = targetDomNode.offsetWidth;
    const elHeight = targetDomNode.offsetHeight;
    const elX = targetDomNode.offsetLeft;
    const elY = targetDomNode.offsetTop;
    const centerX = elX + elWidth/2;
    const centerY = elY + elHeight/2;

    const degInc = 360/this.widgetRefs.length;

    this.widgetRefs
      .map((ref, index) => {
        const domNode = ReactDOM.findDOMNode(this.refs[ref]);
        this.plumbInstance.connect({
          source:domNode,
          target:targetDomNode
        });

        const inc = degInc * index;
        const angleVec = new Victor(100, 100)
          .rotateDeg(inc)
          .normalize();

        const outsidePoint = angleVec.clone()
          .multiplyScalar(10000);

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
          this.plumbInstance.repaintEverything();
        }});

      });

      if (showAudioRecorder) {
        const arWidth = this.audioRecorderContainer.offsetWidth;
        console.log('arWidth', arWidth, this.audioRecorderContainer);
        TweenMax.to(this.audioRecorderContainer, 1, {left:centerX-arWidth/2, top:centerY+elHeight/2 + 20, ease:Expo.easeOut});
      }
  }

  _buildWidgets () {
    const widgets = [];
    this.widgetRefs = [];
    const count = 0;
    for(let i = 0; i < count; i++){
      let ref = `widget_${i}`;
      this.widgetRefs.push(ref);
      let el = (<SoundByte key={ref} ref={ref}/>);
      widgets.push(el);
    }

    return widgets;
  }

  _renderAudioRecorder () {
    const { showAudioRecorder } = this.state;
    const audioRecorderStyles = {
      position: 'absolute'
    }

    if (showAudioRecorder) {
        return (
          <div ref={node=>this.audioRecorderContainer = node} style={audioRecorderStyles}>
            <AudioRecorder />
          </div>
        );
    } else {
      return '';
    }

  }

  render () {
    const styles = {
      minWidth: '100%',
      position: 'relative',
      display: 'flex'
    };

    const { model: { id } } = this.props;

    return (
      <div ref='plumbContainer' style={styles}>
        {this._renderAudioRecorder()}
        <KnowledgeTarget ref='knowledgeTarget' langitId={id} audioFunc={::this._showAudioRecorder} />
        {this._buildWidgets()}
      </div>
    );
  }
}
