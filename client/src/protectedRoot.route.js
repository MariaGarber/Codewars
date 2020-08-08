import React from 'react';
import { Route } from 'react-router-dom';
import { checkCookie } from '../src/cookies';
import HomePage from '../src/components/HomePage/HomePage';
import Dashboard from '../src/components/Dashboard/Dashboard';

export const ProtectedRoot = ({ ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (checkCookie('id')) {
          return <Dashboard {...props} />;
        } else {
          return <HomePage {...props} />;
        }
      }}
    />
  );
};
