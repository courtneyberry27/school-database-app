import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

/*************************
 * USER SIGN IN CLASS
 *************************/
export default class UserSignIn extends Component {
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }

  //THIS.STATE SET
  render() {
    const {
      emailAddress,
      password,
      errors,
    } = this.state;

  //RETURN FORMAT
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text"
                  value={emailAddress} 
                  onChange={this.change} 
                  placeholder="Email Address" />
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" />                
              </React.Fragment>
            )} />
          <p>
            Don't have a user account? <Link to="/signup">Click here</Link> to sign up!
          </p>
        </div>
      </div>
    );
  }

/*************************
 * CHANGE FUNCTION
 *************************/
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

/*************************
* SUBMIT FUNCTION
*************************/
  submit = () => {
    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { emailAddress, password} = this.state;
    context.actions.signIn(emailAddress, password)
    .then( user => {
      if (user === null) {
        this.setState(() => {
          //UNSUCCESSFUL
          return { errors: [ 'Sign-in was unsuccessful' ] }
        })
      } else {
        //SUCCESSFUL
        this.props.history.push(from)
        console.log(`${emailAddress} is now signed in!`)
      }
    })
    .catch( err => {
      console.log(err);
      this.props.history.push('/error')
    })
  }

/*************************
* CANCEL FUNCTION
*************************/
  cancel = () => {
    //PUSH TO MAIN
    this.props.history.push('/')
  }
}