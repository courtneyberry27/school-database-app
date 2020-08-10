import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext();

export class Provider extends Component {

  constructor() {
    super();
    this.data = new Data();
  };

  state = {
    //COOKIES AUTH
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null
  };

  render() {
    const { authenticatedUser } = this.state;

    const value = {
      authenticatedUser,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        parseValidationErrors: this.parseValidationErrors
      }
    }

    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

/*****************************
 * SIGN IN FUNCTION
 *****************************/
  signIn = async (username, password) => {
    let user = await this.data.getUser(username, password);
    if (user) {
      user = {...user, password }
      this.setState({ authenticatedUser: user });
      console.log(`${user.firstName} is logged in!`)
      // set cookie
      Cookies.set('authenticatedUser', JSON.stringify(user));
    }
    return user;
  }
/*****************************
 * SIGN OUT FUNCTION
 *****************************/
  signOut = () => {
    this.setState({ authenticatedUser: null });
    Cookies.remove('authenticatedUser');
  };

/*****************************
 * VALIDATION
 *****************************/
  parseValidationErrors = (errors) => {
    const parsedErrors = errors.map(error => {
      const parts = error.split('_');
      return {
        field: parts[0],
        message: parts[1]
      }
    });
    
    return parsedErrors;
  };
};


export const Consumer = Context.Consumer;

/*********************************************************************************************************************
 * WITH CONTEXT FUNCTION - wraps provided component in Context Consumer component.
 *********************************************************************************************************************/
export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  };
};
