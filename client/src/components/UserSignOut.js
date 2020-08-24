import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

/*************************
 * USER SIGN OUT CLASS
 *************************/
export default ({ context }) => {
  //use signOut effect
  useEffect(() =>context.actions.signOut());

  return (
    <Redirect to="/" />
  );
}
