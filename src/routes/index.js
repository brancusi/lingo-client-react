import {
  Route,
  IndexRoute }            from 'react-router';
import React              from 'react';
import CoreLayout         from 'layouts/CoreLayout';
import ApplicationView    from 'views/ApplicationView';
import AuthenticatedView  from 'views/AuthenticatedView';
import HomeView           from 'views/HomeView';
import SessionView        from 'views/SessionView';

export default (
  <Route component={CoreLayout}>
    <Route path='/' component={ApplicationView}>
      <IndexRoute component={HomeView} />
      <Route component={AuthenticatedView}>
        <Route name='sessions' path='/sessions/:id' component={SessionView}/>
      </Route>
    </Route>
  </Route>
);
