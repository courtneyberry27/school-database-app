import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export default class UserSignIn extends Component {
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  };

  render() {
    const {
      email,
      password,
      errors,
    } = this.state;

    let validation = null;
    if (errors.length > 0) {
      validation = (
        <div className="container-error" role="alert">
          <h2>Validation errors</h2>
          <p>{errors}</p>
        </div>
      );
    }

    return (
      <div className="center-content">
        <div className="container-form-user">
          <h1>Sign In</h1>
          {validation}
          <form onSubmit={this.submit}>
            <label htmlFor="email">Email / Username</label>
            <input 
              id="email" 
              name="email" 
              type="text"
              value={email}
              aria-required="true"
              onChange={this.change} 
              placeholder="Email / Username"
              autoComplete="username"
              autoFocus />
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password"
              type="password"
              value={password}
              aria-required="true"
              onChange={this.change} 
              placeholder="Password"
              autoComplete="current-password" />                
            <div className="container-buttons">
              <button type="submit">Sign In</button>
              <button className="button-nav" onClick={this.cancel}>Cancel</button>
            </div>
          </form>
          <p>
            Don't have a user account? <Link to="/signup">Click here</Link> to sign up!
          </p>
        </div>
      </div>
    );
  }

/***************************
* CHANGE SIGN IN FUNCTION
****************************/
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  };

/***************************
* SUBMIT SIGN IN FUNCTION
****************************/
  submit = (e) => {
    e.preventDefault();
    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } }; //this.props.location.state is set in PrivateRoute.js
    const { emailAddress, password } = this.state;

    context.actions.signIn(emailAddress, password)
      .then( user => {
        if (user.status === 200) {
          this.props.history.push(from);
          console.log(`${emailAddress} is signed in!`);
        } else if (user.status === 401) {
          this.setState(() => {
          return { errors: user.errors };
          });
        };
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error');
      });
  };

/***************************
* CANCEL SIGN IN FUNCTION
****************************/
  cancel = (e) => {
    e.preventDefault();
    this.props.history.push('/');
  };
};
