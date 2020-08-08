import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { checkCookie } from './cookies';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (checkCookie('id')) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};
