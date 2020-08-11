import React, {Component} from 'react';
import Form from './Form';

export default class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: [],
  }

  componentDidMount() {
    document.title = 'Courses | Create';
  }

  render() {
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
    } = this.state;

    return (
      <>
        <h1>Create Course</h1>
        <Form
          change={this.change}
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Create"
          title={title}
          description={description}
          estimatedTime={estimatedTime}
          materialsNeeded={materialsNeeded}
        />
      </>
    );
  }

/**************************
* CHANGE FUNCTION
**************************/
  change = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  };

/**************************
* SUBMIT FUNCTION
**************************/
submit = () => {
  // this gets the signed in user and the data methods
  const { context } = this.props;
  const user = context.authenticatedUser

  // this is the info for the new course
  const {
    title,
    description,
    estimatedTime,
    materialsNeeded
  } = this.state;

  // create a new course with current user id
  const course = { title, description, estimatedTime, materialsNeeded, userId: user.id };
  
  context.data.createCourse(user.emailAddress, user.password, course)
    .then(data => {
      if (data.errors) {
        // validation errors
        const valErrors = context.actions.parseValidationErrors(data.errors);
        this.setState({ errors: valErrors });
      } else {
        // course created successfully, go to newly created course page
        this.props.history.push(data.location)
      }
    })
    // handle rejected promise: issue with endpoint, api down, network connectivity error
    .catch( err => {
      console.log(err);
      this.props.history.push('/error'); // push to history stack will redirect to error page
    });
}
/**************************
* CANCEL FUNCTION
**************************/
  cancel = () => {
    this.props.history.push('/');
  };
};
