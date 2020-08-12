import React, { Component } from "react";
import "../App.css";
import Course from "./Course";
// import { Link } from "react-router-dom";
// import { withRouter } from "react-router";
import Notfound from './NotFound';

/*************************
 * COURSES CLASS
 *************************/
export default class Courses extends Component  {
  
  state = {
    courses: []
  }

/*************************
 * DID MOUNT? SECTION
 *************************/
  async componentDidMount() {
    const { context } = this.props;
    context.data.getCourse().then(response => {
      this.setState({
        courses: response
      })
    })
  }

  render() {
    let courses;

    //FOR EACH COURSE
    if(this.state.courses.length > 0) {
      courses = this.state.courses.map((course) => 
        <Course
          key= {course.id}
          title= {course.title}
          url= {`/courses/${course.id}`}
        />
      );
    } else {
      //NOT FOUND
      courses = <Notfound />
    }

    //FORMAT
    return(
      <div className="bounds">
        {courses}
        <div className="grid-33">
          <a className="course--module course--add--module" href="/courses/create">
            <h3 className="course--add--title">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
            </svg>New Course</h3>
          </a>
        </div>
      </div>
    )
  }
}