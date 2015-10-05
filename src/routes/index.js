import { Route }          from 'react-router';
import React              from 'react';
import CoreLayout         from 'layouts/CoreLayout';
import HomeView           from 'views/HomeView';
import SessionView        from 'views/SessionView';

export default (
  <Route component={CoreLayout}>
    <Route name='home' path='/' component={HomeView} />
    <Route name='sessions' path='/sessions/:id' component={SessionView} />
  </Route>
);
