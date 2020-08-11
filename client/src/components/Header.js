import React from 'react';
import { NavLink } from 'react-router-dom';

import { AuthConsumer } from '../Context';

// Contains the Sign In/Up/Out. Changes from Up to Out and displays user's name when signed in.
const Header = () => {
  return (
    <AuthConsumer>
      {({ isAuth, name, signOut }) => (
        <div className="header">
          <div className="bounds">
            <NavLink to="/">
              <h1 className="header--logo">Courses</h1>
            </NavLink>
            <nav>
              {isAuth ? (
                <div>
                  <NavLink className="signin" to="signin">
                    {`Welcome, ${name}`}
                  </NavLink>
                  <NavLink className="signout" to="/signout" onClick={signOut}>
                    Sign Out
                  </NavLink>
                </div>
              ) : (
                <div>
                  <NavLink className="signin" to="../signin">
                    Sign In
                  </NavLink>
                  <NavLink className="signup" to="../signup">
                    Sign Up
                  </NavLink>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </AuthConsumer>
  );
};

export default Header;