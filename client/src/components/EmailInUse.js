import React from 'react';
import { Link }from 'react-router-dom';

/****************************
 * HANDLE EMAIL IN USE ERROR
 ****************************/
const EmailInUse = () => {
  return(
    <div className="bounds">
      <h1>Email Already In Use:</h1>
      <p>Please try signing up with a different email address.</p>
      <div className="button">
        <Link to="/signup">Return To Sign Up</Link>
      </div>
    </div>
  )
}

export default EmailInUse;
