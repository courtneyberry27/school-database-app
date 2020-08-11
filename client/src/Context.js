// import React, { Component } from 'react';
// import Data from './Data';
// import Cookies from 'js-cookie';

// const Context = React.createContext();

// export class Provider extends Component {

//   state = {
//     authenticatedUser: Cookies.getJSON('authenticatedUser') || null
//   };

//   constructor() {
//     super();
//     this.data = new Data();
//   }

//   render() {
//     const { authenticatedUser } = this.state;

//     const value = {
//       authenticatedUser,
//       data: this.data,
//       actions: {
//         signIn: this.signIn,
//         signOut: this.signOut,
//         parseValidationErrors: this.parseValidationErrors
//       }
//     }

//     return (
//       <Context.Provider value={value}>
//         {this.props.children}
//       </Context.Provider>  
//     );
//   }

// /*****************************
//  * SIGN IN FUNCTION
//  *****************************/
//   signIn = async (username, password) => {
//     let user = await this.data.getUser(username, password);

//     if (user) {
//       user = {...user, password }
//       this.setState({ authenticatedUser: user });
//       console.log(`${user.firstName} is logged in!`)
//       //SET COOKIES
//       Cookies.set('authenticatedUser', JSON.stringify(user));
//     }
//     return user;
//   }

// /*****************************
//  * SIGN OUT FUNCTION
//  *****************************/
//   signOut = () => {
//     this.setState({ authenticatedUser: null });
//     Cookies.remove('authenticatedUser');
//   }

// /*****************************
//  * PARSE VALIDATION FUNCTION
//  *****************************/
//   parseValidationErrors = (errors) => {
//     // split error string
//     const parsedErrors = errors.map(error => {
//       const parts = error.split('_');
//       return {
//         field: parts[0],
//         message: parts[1]
//       }
//     });
    
//     return parsedErrors;
//   }
// }

// export const Consumer = Context.Consumer;

// /*********************************************************************************************************************
//  * WITH CONTEXT FUNCTION - wraps provided component in Context Consumer component.
//  *********************************************************************************************************************/
// export default function withContext(Component) {
//   return function ContextComponent(props) {
//     return (
//       <Context.Consumer>
//         {context => <Component {...props} context={context} />}
//       </Context.Consumer>
//     );
//   }
// }


import React, { Component } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

// Handles SignIn/Out/Up. User automatically signed in after signing up.
// Uses localStorage to persist user credentials.
class AuthProvider extends Component {
  state = {
    isAuth: false,
    _id: null,
    name: null,
    firstName: null,
    lastName: null,
    emailAddress: null,
    password: null,
    confirmPassword: null,
    errors: null,
    ownsCourse: false
  };

  componentDidMount() {
    this.updateState();
  }

  // Sets state to user creds in localStorage.
  updateState = () => {
    return Object.keys(this.state).map(key => {
      return this.setState({
        [key]: localStorage.getItem(key)
      });
    });
  };

  // Updates localStorage when signing up/in.
  updateStorage = () => {
    return Object.keys(this.state).map(key => {
      return localStorage.setItem(key, this.state[key]);
    });
  };

  signIn = e => {
    if (e) e.preventDefault();
    const { emailAddress, password } = this.state;

    axios
      .get(`http://localhost:5000/api/users`, {
        auth: {
          username: emailAddress,
          password
        }
      })
      .then(response => {
        this.setState({
          isAuth: true,
          _id: response.data.id,
          emailAddress,
          password,
          name: response.data.name
        });
        this.updateStorage();
      })
      .catch(err => {
        console.log('Error signing in', err);
      });
  };

  signUp = e => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword
    } = this.state;

    axios
      .post(`http://localhost:5000/api/users`, {
        firstName,
        lastName,
        emailAddress,
        password,
        confirmPassword
      })
      .then(() => {
        this.signIn();
      })
      .catch(err => {
        if (err.response.status === 400) {
          const errors = err.response.data.message;
          const messages = Object.values(errors).map(err => {
            return err.message;
          });
          this.setState({
            errors: messages
          });
        } else {
          console.log('Error signing up', err);
        }
      });
  };

  // Logs user out and clears localStorage.
  signOut = () => {
    this.setState({
      isAuth: false,
      name: null,
      emailAddress: null,
      password: null
    });
    localStorage.clear();
  };

  // Checks if current user owns the course they clicked. Called in ActionsBar to determine whether to show the update and delete buttons.
  isCourseOwner = courseId => e => {
    if (this.state._id === courseId) {
      this.setState({
        ownsCourse: true
      });
    } else {
      this.setState({
        ownsCourse: false
      });
    }
  };

  // Updates as user types in inputs.
  handleChange = e => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    });
    localStorage.setItem([e.currentTarget.name], e.currentTarget.value);
  };

  render() {
    const { _id, isAuth, name, errors, ownsCourse } = this.state;

    return (
      <AuthContext.Provider
        value={{
          id: _id,
          state: this.state,
          isAuth,
          signIn: this.signIn,
          signUp: this.signUp,
          signOut: this.signOut,
          name,
          handleChange: this.handleChange,
          errors,
          isCourseOwner: this.isCourseOwner,
          ownsCourse
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };