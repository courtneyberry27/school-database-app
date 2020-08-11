import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div className="bounds">
      <h1>Forbidden</h1>
      <p>Oh No! It looks like you do not have access to this page!</p>
      <div className="button">
        <Link to="/">Return Home</Link>
      </div>
    </div>
  )
}
