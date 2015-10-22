import React from 'react';
import ReactDOM from 'react-dom';

import Radium from 'radium';
import plumb from 'imports?this=>window!script!../../node_modules/jsplumb/dist/js/jsPlumb-2.0.3-min.js';

import SoundByte from 'components/widgets/audio/SoundByte';
import AudioRecorder from 'components/widgets/audio/AudioRecorder';

import KnowledgeTarget from 'components/widgets/text/KnowledgeTarget';

import Victor from 'victor';

import { aabbLine } from 'utils/geom';

import {
  uploadAudio,
  processWidgetData
} from 'actions/langit';

@Radium
export default class Langit extends React.Component {
  static propTypes = {
    model: React.PropTypes.object.isRequired,
    saveRecording: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {showAudioRecorder: false};
  }

  componentDidMount () {
    this._createPlubInstance();
    this._positionElements();
    this._addFBListeners
  }

  _addFBListeners () {
      const { dispatch, model: { id } } = this.props;
      const baseFBUrl = 'https://lingoapp.firebaseio.com/';
      this.fbChatRef = new Firebase(`${baseFBUrl}langits/${id}/widgets`);
      this.fbChatRef.on('value', snapShot => dispatch(processWidgetData(snapShot.val())));
  }

  componentDidUpdate (prevProps, prevState) {
    this._positionElements();

    const showAudioRecorderChanged = prevState.showAudioRecorder !== this.state.showAudioRecorder;
    if(showAudioRecorderChanged)this._syncAudioRecorderState();
  }

  _toggleAudioRecorder () {
    this.setState({showAudioRecorder:!this.state.showAudioRecorder});
  }

  _saveRecording ( recording ) {
    const { saveRecording, model } = this.props;
    saveRecording(model, recording);
    this.setState({showAudioRecorder:false});
  }

  _cancelRecording () {
    this.setState({showAudioRecorder:false});
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
  }

  _syncAudioRecorderState () {
    const { showAudioRecorder } = this.state;

    if (showAudioRecorder) {

      const { knowledgeTarget } = this.refs;
      const targetDomNode = ReactDOM.findDOMNode(knowledgeTarget);

      const elWidth = targetDomNode.offsetWidth;
      const elHeight = targetDomNode.offsetHeight;
      const elX = targetDomNode.offsetLeft;
      const elY = targetDomNode.offsetTop;
      const centerX = elX + elWidth/2;
      const centerY = elY + elHeight/2;

      const arWidth = this.audioRecorderContainer.offsetWidth;
      const arHeight = this.audioRecorderContainer.offsetHeight;
      TweenMax.to(this.audioRecorderContainer, 0.25, {
        startAt: {
          top:centerY-arHeight/2,
          left:centerX-arWidth/2
        },
        left:centerX-arWidth/2,
        top:centerY+elHeight/2 + 20,
        ease:Expo.easeOut});
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

  _renderAudioRecorder (position) {

    const { showAudioRecorder } = this.state;

    const audioRecorderContainerStyles = {
      position: 'absolute'
    }

    if (showAudioRecorder) {
        return (
          <div ref={node=>this.audioRecorderContainer = node} style={audioRecorderContainerStyles}>
            <AudioRecorder save={::this._saveRecording} cancel={::this._cancelRecording} />
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
        <KnowledgeTarget ref='knowledgeTarget' langitId={id} audioFunc={::this._toggleAudioRecorder} />
        {this._buildWidgets()}
      </div>
    );
  }
}
