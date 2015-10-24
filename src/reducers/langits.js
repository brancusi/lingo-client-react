import { createReducer } from 'utils';
import { Map, fromJS } from 'immutable';

import * as Actions from 'constants/langit';

const initialState = new Map();

export default createReducer(initialState, {

  [ Actions.PROCESS_WIDGET_DATA ]:(state, payload)=> {
    return state.mergeDeep({[payload.id]:{widgets:payload.widgets}});
  }
});
