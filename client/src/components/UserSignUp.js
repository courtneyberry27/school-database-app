import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

/*************************
 * USER SIGN UP CLASS
 *************************/
export default class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword:'',
    errors: [],
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors,
    } = this.state;

    //format
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => (
              <React.Fragment>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text"
                  value={firstName} 
                  onChange={this.change} 
                  placeholder="First Name" />
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text"
                  value={lastName} 
                  onChange={this.change} 
                  placeholder="Last Name" />
                <input 
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  value={emailAddress}
                  onChange={this.change}
                  placeholder="Email Address"/>
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" />
                <input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword} 
                  onChange={this.change} 
                  placeholder="Confirm Password" />
              </React.Fragment>
            )} />
          <p>
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
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

    //change old value to new
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
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword
    } = this.state;

    const user = {
      firstName,
      lastName,
      emailAddress,
      password,
    };
    
    //check if matching passwords
    if(confirmPassword === password) {
      //create user
      context.data.createUser(user)
          .then(errors => {
              if(errors.length) {
                //if errors with sign up
                  this.setState({ errors });
              }
              else {
                //if no errors
                  console.log(`${emailAddress} is signed up!`);
                  context.actions.signIn(emailAddress, password);
                  this.props.history.push('/signin');
              }
          })
          //handle rejected promise
          .catch( err => { 
              console.log('Oops! Email already in Use.', err);
              this.props.history.push('/email-in-use'); 
          });   
    }  else {
      this.setState({
        errors: 'Passwords do not match.'
      });
    }  
};

/*************************
 * CANCEL FUNCTION
 *************************/
  cancel = () => {
    this.props.history.push('/');
  }
}
