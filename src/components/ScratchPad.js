import React from 'react';
import Radium from 'radium';
import Langit from 'components/Langit';
import { Map } from 'immutable';
import { LANGIT } from 'constants/widgets';

@Radium
export default class ScratchPad extends React.Component {
  static propTypes = {
    scratchPad: React.PropTypes.object.isRequired,
    langits: React.PropTypes.object,
    saveRecording: React.PropTypes.func.isRequired,
    dispatch: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    this._setupPanning();
    this._scrollToEnd();
  }

  componentDidUpdate () {
    this._scrollToEnd();
  }

  componentWillUnmount () {
    this.dragsSubscription.dispose();
  }

  _scrollToEnd () {
    const { canvas } = this.refs;
    TweenMax.to(canvas, 0.25, {scrollTo:{x:'max'}});
  }

  _setupPanning () {
    const { canvas } = this.refs;

    const hammer = new Hammer(canvas, { direction: Hammer.DIRECTION_ALL, threshold: 0 });

    const panStarts = Rx.Observable.fromEventPattern(
        (h) => hammer.on('panstart', h),
        (h) => hammer.off('panstart', h)
    );

    const pans = Rx.Observable.fromEventPattern(
        (h) => hammer.on('pan', h),
        (h) => hammer.off('pan', h)
    )
      .map(e => e.deltaX);

    const panEnds = Rx.Observable.fromEventPattern(
        (h) => hammer.on('panend', h),
        (h) => hammer.off('panend', h)
    )
      .map(e => e.deltaX);

    this.dragsSubscription = panStarts
      .filter(e => e.srcEvent.srcElement.className !== 'ace_content')
      .subscribe(e => {
        const startX = e.deltaX;
        const canvasOriginX = canvas.scrollLeft + startX;
        canvas.scrollLeft = canvasOriginX;

        pans
          .takeUntil(panEnds)
          .distinctUntilChanged()
          .subscribe(x => canvas.scrollLeft = canvasOriginX - x);
      });
  }

  _langitWithId (id) {
    const { langits = new Map() } = this.props;
    const match = langits.get(id);
    if(match !== undefined || match != null){
      return match;
    }else{
      return null;
    }
  }

  _createLangit (id) {
    const data = this._langitWithId(id);
    const { saveRecording, dispatch } = this.props;
    const props = {
      id,
      model: data,
      key: id,
      saveRecording,
      dispatch
    };

    return (<Langit {...props} />)
  }

  _buildScratchElement (item) {
    switch(item.type) {
      case LANGIT :
        return this._createLangit(item.id);
      break;
    }
  }

  render () {
    const styles = {
      display: 'flex'
    };

    const canvasStyles = {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      overflowX:'auto'
    };

    const { scratchPad } = this.props;

    const itemList = scratchPad
      .sort((a, b) => a.t - b.t)
      .map(item => this._buildScratchElement(item))
      .toArray();

    return (
      <div className='col-sm-12' style={styles}>
        <div ref='canvas' style={canvasStyles}>
          {itemList}
        </div>
      </div>
    );
  }
}
