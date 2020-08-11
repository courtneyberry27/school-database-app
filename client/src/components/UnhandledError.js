import React from 'react';
import { Link }from 'react-router-dom';

export default () => {
  return(
    <div className="bounds">
      <h1>Error</h1>
      <p>We are sorry, an unexpected error has occurred!</p>
      <div className="button">
        <Link to="/">Return Home</Link>
      </div>
    </div>
  );
};

