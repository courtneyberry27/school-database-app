import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthConsumer } from './Context';

// Used for CreateCourse and UpdateCourse. Redirects to SignIn if user not logged in.
// Redirects back to the last page visited after signing in.
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <AuthConsumer>
      {({ isAuth }) => (
        <Route
          render={props =>
            isAuth ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: '/signin',
                  state: { from: props.location }
                }}
              />
            )
          }
          {...rest}
        />
      )}
    </AuthConsumer>
  );
};

export default PrivateRoute;
