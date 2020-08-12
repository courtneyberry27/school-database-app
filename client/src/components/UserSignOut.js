import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

/*************************
 * USER SIGN OUT CLASS
 *************************/
export default ({ context }) => {
  useEffect(() =>context.actions.signOut());

  return (
    <Redirect to="/" />
  );
}