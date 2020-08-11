import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext();

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    password: Cookies.getJSON('password') || null
  };

  constructor() {
    super();
    this.data = new Data();
  }

  render() {
    const { authenticatedUser, password } = this.state;

    const value = {
      authenticatedUser,
      password,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut
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
  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    if (user !== null) {
      user.password = password;
      user.emailAddress = user.Email;
      this.setState(() => {
        return {
          authenticatedUser: user,
        };
      });
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
    }
    return user;
  } 

/*****************************
 * SIGN OUT FUNCTION
 *****************************/
  signOut = () => {
    this.setState(() => {
      return {
        authenticatedUser: null,
      };
    });
    Cookies.remove('authenticatedUser');
  }
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
  }
}
