import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import plumb from 'imports?this=>window!script!../../node_modules/jsplumb/dist/js/jsPlumb-2.0.3-min.js';
import SoundByte from 'components/widgets/audio/SoundByte';
import AudioRecorder from 'components/widgets/audio/AudioRecorder';
import KnowledgeTarget from 'components/widgets/text/KnowledgeTarget';
import Victor from 'victor';
import Rx from 'rx';
import { aabbLine } from 'utils/geom';
import {
  uploadAudio,
  processWidgetData
} from 'actions/langit';
import { fromJS, List } from 'immutable';

@Radium
export default class Langit extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    model: React.PropTypes.object,
    saveRecording: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.widgetRefs = List();
    this.state = {showAudioRecorder: false};
  }

  componentDidMount () {
    this._createPlubInstance();
    this._positionElements();
    this._addFBListeners();
    this._addResizeListeners();
  }

  shouldComponentUpdate (nextProps, nextState) {
    const propsChanged = this._hasChanged(nextProps.model, this.props.model);
    const stateChanged = (this.state.showAudioRecorder !== nextState.showAudioRecorder);
    return propsChanged || stateChanged;
  }

  componentDidUpdate (prevProps, prevState) {
    if(this._hasChanged(this.props.model, prevProps.model))this._positionElements();
    if(this.state.showAudioRecorder !== prevState.showAudioRecorder)this._positionElements();
  }

  _hasChanged (obj, against) {
    return !obj.equals(against);
  }

  _addFBListeners () {
    const { dispatch, id } = this.props;
    const baseFBUrl = 'https://lingoapp.firebaseio.com/';
    const langitUrl = `${baseFBUrl}langits/${id}/widgets`;
    this.fbChatRef = new Firebase(langitUrl);
    this.fbChatRef.on('value', snapShot => {
      dispatch(processWidgetData({id, widgets:snapShot.val()}));
    });
  }

  _addResizeListeners () {
    this.resizes = Rx.Observable.fromEvent(window, 'resize');
    this.resizes
      .subscribe(e => this._positionElements(0));
  }

  _toggleAudioRecorder () {
    this.setState({showAudioRecorder:!this.state.showAudioRecorder});
  }

  _saveRecording ( recording ) {
    const { saveRecording, id } = this.props;
    saveRecording(id, recording);
    this.setState({showAudioRecorder:false});
  }

  _cancelRecording () {
    this.setState({showAudioRecorder:false});
  }

  _createPlubInstance () {
    this.plumbInstance = jsPlumb.getInstance({Container: this.plumbContainer});
    this.plumbInstance.importDefaults({
      Connector : [ "Straight" ],
      Anchors : [ "Center", "Center" ],
      Endpoints: ['Blank', 'Blank']
    });
  }

  _positionElements ( speed = 0.25 ) {
    const { kwCenterX, kwCenterY, kwWidth, kwHeight } = this._positions();
    const startAngle = 150;
    const endAngle = 50;
    const availableDeg = 360 - (startAngle - endAngle)
    const degInc = availableDeg/this.widgetRefs.size;

    this._positionAudioPlayer(speed);

    this.widgetRefs
      .map(ref => this.refs[ref])
      .map((domNode, index) => {

        this.plumbInstance.connect({
          source:domNode,
          target:this.knowledgeTargetContainer
        });

        const inc = degInc * index;

        const angleVec = new Victor(100, 100)
          .rotateToDeg(startAngle)
          .rotateDeg(inc)
          .normalize()
          .multiplyScalar(10000);

        const left = -kwWidth/2;
        const right = kwWidth/2;
        const top = -kwHeight/2;
        const bottom = kwHeight/2;

        const boxPoint = aabbLine(angleVec.x, angleVec.y, left, top, right, bottom);

        const mag = new Victor(boxPoint.x, boxPoint.y).length();

        const destVec = new Victor(boxPoint.x, boxPoint.y)
          .normalize()
          .multiplyScalar(mag + 100);

        const startX = (boxPoint.x + kwCenterX);
        const startY = (boxPoint.y + kwCenterY);
        const targetX = (destVec.x + kwCenterX);
        const targetY = (destVec.y + kwCenterY);

        TweenMax.to(domNode, speed, {
          startAt: {
            left:startX,
            top:startY
          },
          left: targetX,
          top: targetY,
          opacity: 1,
          ease: Expo.easeOut,
          onUpdate:()=>{
            this.plumbInstance.repaintEverything();
          }
        });

      });
  }

  _positionAudioPlayer ( speed = 0.25 ) {
    const { showAudioRecorder } = this.state;

    if (showAudioRecorder) {
      const { kwCenterX, kwCenterY, kwHeight } = this._positions();
      const arWidth = this.audioRecorderContainer.offsetWidth;
      const arHeight = this.audioRecorderContainer.offsetHeight;

      const startX = kwCenterX-arWidth/2;
      const startY = kwCenterY-arHeight/2;
      const targetX = kwCenterX-arWidth/2;
      const targetY = kwCenterY+kwHeight/2 + 20;

      TweenMax.to(this.audioRecorderContainer, speed, {
        startAt: {
          left: startX,
          top: startY
        },
        opacity: 1,
        left: targetX,
        top: targetY,
        ease:Expo.easeOut});
    }
  }

  _positions () {
    const kwWidth = this.knowledgeTargetContainer.offsetWidth;
    const kwHeight = this.knowledgeTargetContainer.offsetHeight;
    const kwLeft = this.knowledgeTargetContainer.offsetLeft;
    const kwTop = this.knowledgeTargetContainer.offsetTop;
    const kwCenterX = kwLeft + kwWidth/2;
    const kwCenterY = kwTop + kwHeight/2;

    return {
      kwWidth,
      kwHeight,
      kwLeft,
      kwTop,
      kwCenterX,
      kwCenterY
    };
  }

  _buildWidgets () {
    const { id, model } = this.props;
    const styles = {
        position: 'absolute',
        opacity: 0
    };

    this.widgetRefs = List();

    if (model) {
      const widgets = model.get('widgets');

      if(widgets){

        return widgets
          .map((widget, id) => {
            const ref = `widget_${id}`;
            this.widgetRefs = this.widgetRefs.push(ref);
            return (
              <div key={ref} ref={ref} style={styles}>
                <SoundByte id={id} model={widget}/>
              </div>
            );
          })
          .toArray();
      }
    }

    return '';
  }

  _renderAudioRecorder (position) {
    const { showAudioRecorder } = this.state;

    const styles = {
      position: 'absolute',
      opacity: 0
    }

    if (showAudioRecorder) {
        return (
          <div ref={node=>this.audioRecorderContainer = node} style={styles}>
            <AudioRecorder save={::this._saveRecording} cancel={::this._cancelRecording} />
          </div>
        );
    } else {
      return '';
    }
  }

  _renderKnowledgeWidget () {
    const { id } = this.props;

    const outerContainerStyles = {
      display: 'flex',
      flex: '1',
      justifyContent: 'center',
      zIndex: 1001,
      pointerEvents:'none'
    };

    const innerContainerStyles = {
      pointerEvents:'none'
    }

    return (
      <div style={outerContainerStyles} >
        <div ref={node => {this.knowledgeTargetContainer = node}} style={innerContainerStyles}>
          <KnowledgeTarget langitId={id} audioFunc={::this._toggleAudioRecorder} />
        </div>
      </div>
    );
  }

  render () {
    const styles = {
      marginTop: '-200px',
      minWidth: '100%',
      position: 'relative',
      display: 'flex'
    };

    return (
      <div ref={node => this.plumbContainer = node} style={styles}>
        {this._renderAudioRecorder()}
        {this._renderKnowledgeWidget()}
        {this._buildWidgets()}
      </div>
    );
  }
}
