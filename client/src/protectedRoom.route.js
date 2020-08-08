import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { checkCookie } from './cookies';

export const ProtectedRoom = ({
  component: Component,
  cname,
  pname,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (checkCookie(cname)) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: pname,
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
