import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Spring } from 'react-spring/renderprops';

import { AuthConsumer } from '../Context';

// All handled in AuthContext. Will send user to the CreateCourse or UpdateCourse if they clicked on that before they were redirected to the SignIn page.
class UserSignIn extends Component {
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    return (
      <AuthConsumer>
        {({ isAuth, handleChange, signIn }) =>
          isAuth ? (
            <Redirect to={from} />
          ) : (
            <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
              {props => (
                <div className="bounds" style={props}>
                  <div className="grid-33 centered signin">
                    <h1>Sign In</h1>
                    <div>
                      <form onSubmit={signIn}>
                        <div>
                          <input
                            id="emailAddress"
                            name="emailAddress"
                            type="text"
                            className=""
                            autoComplete="username"
                            placeholder="Email Address"
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            className=""
                            autoComplete="current-password"
                            placeholder="Password"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="grid-100 pad-bottom">
                          <button className="button" type="submit">
                            Sign In
                          </button>
                          <NavLink className="button button-secondary" to="/">
                            Cancel
                          </NavLink>
                        </div>
                      </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>
                      Don't have a user account?
                      <NavLink to="/signup"> Click here</NavLink> to sign up!
                    </p>
                  </div>
                </div>
              )}
            </Spring>
          )
        }
      </AuthConsumer>
    );
  }
}

export default UserSignIn;