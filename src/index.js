import React                from 'react';
import ReactDOM             from 'react-dom';
import Root                 from './containers/Root';
import configureStore       from './stores';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {Iterable} from 'immutable';

Iterable.prototype[Symbol.for('get')] = function monkeyPatch(value) {return this.get(value); };

const target = document.getElementById('root');
const store  = configureStore(window.__INITIAL_STATE__);

const node = <Root routerHistory={createBrowserHistory()} store={store}/>;
ReactDOM.render(node, target);
