import React from 'react';
import { Link } from 'react-router-dom';

const Notfound = () => {
  return(
    <div className="bounds">
      <h1>Not Found</h1>
      <p>Oops! It looks like we couldn't find the page you were looking for.</p>
      <div className="button">
        <Link to="/">Return Home</Link>
      </div>
    </div>
  )
}

export default Notfound;