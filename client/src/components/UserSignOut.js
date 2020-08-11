import React from 'react';
import { Redirect } from 'react-router-dom';

// Per instructions, App.js routes to /signout, then this redirects to main courses page.
const UserSignOut = () => {
  return <Redirect to="/" />;
};

export default UserSignOut;