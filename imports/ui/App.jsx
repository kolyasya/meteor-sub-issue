import React, { Suspense } from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';

import { Link } from 'react-router-dom';

import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import queryString from 'query-string';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>

    <Router>
      <QueryParamProvider
        adapter={ReactRouter5Adapter}
        options={{
          searchStringToObject: queryString.parse,
          objectToSearchString: queryString.stringify,
        }}
      >
        <Route exact path="/main">
          <Suspense fallback={<div>Loading...</div>}>
            <div>Main Page</div>
            <Link to="/test/123456">Go Info</Link>
          </Suspense>
        </Route>
        <Route exact path="/test/:docId">
          <Suspense fallback={<div>Loading...</div>}>
            <Info />
          </Suspense>
        </Route>

        <Redirect to="/test/123456" />
      </QueryParamProvider>
    </Router>
  </div>
);
