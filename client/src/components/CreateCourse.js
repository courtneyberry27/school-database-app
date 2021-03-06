import React, { Component, Fragment } from 'react';
import Form from './Form';
import Data from '../Data';

/*************************
 * CREATE COURSE CLASS
 *************************/
export default class CreateCourse extends Component {
  /*************************
   * CONSTRUCTOR
   *************************/
  constructor() {
    super()
    this.data = new Data();
  }

  state = {
    title: '',
    description:'',
    estimatedTime:'',
    materialsNeeded:'',
    userId: '',
    name: '',
    errors: [],
  }

  /*************************
  * DID MOUNT? SECTION
  *************************/
  componentDidMount() {
    const { context } = this.props;
    this.setState(() => {
      //get auth 
      return {
        userId: context.authenticatedUser.Id,
        name: context.authenticatedUser.Name
      }
    })
  }

  render() {
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;
    
    //format
    return(
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <Form
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Create Course"
          elements={() => (
            <Fragment>
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div>
                    <input 
                      id="title" 
                      name="title" 
                      type="text" 
                      value={title}
                      onChange={this.change} 
                      className="input-title course--title--input" 
                      placeholder="Course title..." />
                  </div>
                  <p>By {this.state.name}</p>
                </div>
                <div className="course--description">
                  <div>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={description}
                      onChange={this.change} 
                      placeholder="Course description..."
                      className="course--description" />
                  </div> 
                </div>
               </div> 
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <div>
                        <input 
                          id="estimatedTime" 
                          name="estimatedTime" 
                          type="text"
                          value={estimatedTime} 
                          onChange={this.change} 
                          className="course--time--input"                              
                          placeholder="Hours" />
                      </div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div>
                        <textarea
                          id="materialsNeeded" 
                          name="materialsNeeded"
                          value={materialsNeeded}
                          onChange={this.change} 
                          placeholder="List materials..." 
                        ></textarea>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Fragment>
          )} />
      </div>
    )
  }

/*************************
 * CHANGE FUNCTION
 *************************/
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    //changes current value to new value
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
    const { emailAddress, password } = context.authenticatedUser;
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId
    } = this.state;

    //each course info
    const course = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId
    };
    
    //uses createCourse() with auth only
    context.data.createCourse(course, emailAddress, password).then( errors => {
      if (errors && errors.length > 0){
        this.setState({ errors });
      } else {
        this.props.history.push('/')
      }
    })
    .catch( err => {
      //error occurred
      console.log(err);
      this.props.history.push('/error');
    });
  }

/*************************
 * CANCEL FUNCTION
 *************************/
  cancel = () => {
    //go back to home page
    this.props.history.push('/');
  }
}
