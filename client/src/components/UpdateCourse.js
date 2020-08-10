import React, {Component} from 'react';

class UpdateCourse extends Component {
  state = {
    courseId: '',
    title: '',
    firstName: '',
    lastName: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors:[]
  };

/***************************
 * DID MOUNT? SECTION
 ***************************/
  componentDidMount() {
    const{ context } = this.props;
    const{ authenticatedUser } = context;
    const{ id } = this.props.match.params;

    context.data.getCourseDetails(id)
    .then(response => {
      if (response) {
        const user = response.course.User;
        this.setState({
          courseId: id,
          title: response.course.title,
          courseByFirstName: user.firstName,
          courseByLastName: user.lastName,
          courseByEmailAddress: user.emailAddress,
          description: response.course.description,
          estimatedTime: response.course.estimatedTime,
          materialsNeeded: response.course.materialsNeeded,
          authenticatedUserEmailAddress: authenticatedUser.emailAddress
        })
      } else {
        this.props.history.push('/notfound');
      };

      if (this.state.courseByEmailAddress !== this.state.authenticatedUserEmailAddress) {
        this.props.history.push(`/forbidden`);
      };
    })
    .catch(err => {
      console.log(err);
      this.props.history.push('/error');
    });
  };

  render() {
    const{ 
      title,
      courseByFirstName,
      courseByLastName,
      description,
      estimatedTime,
      materialsNeeded,
      errors,
     } = this.state;
    
    return (
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <div>
          {errors.length ? 
            <React.Fragment>
              <h2 className="validation--errors--label">Validation errors</h2>
              <div className="validation-errors">
                <ul>
                  {errors.map((err, index) =>
                    <li key={index}>{err}</li>
                  )}
                </ul> 
              </div>
            </React.Fragment>
            : 
            <hr />
          }
          <form onSubmit={this.update}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                  <input onChange={this.change} id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={title} />
                </div>
                <p>By {courseByFirstName} {courseByLastName}</p>
              </div>

              <div className="course--description">
                <div>
                  <textarea onChange={this.change} id="description" name="description" className="" placeholder="Course description..." value={description}></textarea>
                </div>
              </div>
            </div>

            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div>
                      <input onChange={this.change}  id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={estimatedTime} />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea onChange={this.change} id="materialsNeeded" name="materialsNeeded" className="" placeholder="Please list each material..." value={materialsNeeded}></textarea></div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid-100 pad-bottom">
              <button className="button" type="submit">Update Course</button><button className="button button-secondary" onClick={this.cancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

/***************************
 * CHANGE FUNCTION
 ***************************/
  change = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState(() => {
      return {
        [name]: value || ''
      };
    });
  };

/***************************
 * UPDATE FUNCTION
 ***************************/
  update = (e) => {
    e.preventDefault();
    const { context } = this.props;
    const { emailAddress } = context.authenticatedUser;
    const { password } = context.authenticatedUser;

    const {
      courseId,
      title,
      description,
      estimatedTime,
      materialsNeeded,
    } = this.state;

    const updatedCourse = {
      title,
      description,
      estimatedTime,
      materialsNeeded
    };

    context.data.updateCourse(courseId, updatedCourse, emailAddress, password)
    .then(errors => {
      if (errors.errors) {
        this.setState({ errors: errors.errors});
      } else {
        const id = this.state.courseId;
        this.props.history.push(`/courses/${id}`);
      };
    })
    .catch(err => {
      console.log(err);
      this.props.history.push('/error');
    });
  };

/***************************
 * CANCEL UPDATE FUNCTION
 ***************************/
  cancel = (e) => {
    e.preventDefault();
    const id = this.state.courseId;
    this.props.history.push(`/courses/${id}`);
  };
};

module.exports = UpdateCourse;