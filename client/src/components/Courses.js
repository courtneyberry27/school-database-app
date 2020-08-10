import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Courses extends Component {
    state = {
        courses: []
      };

    componentDidMount() {
        const { context } = this.props;
        context.data.getCourses()
            .then(res => this.setState({ courses: res.courses }))
            .catch(err => {
                console.log(err);
                this.props.history.push('/error');
            });
    };

    render() {
        return (
            <React.Fragment>
                <div class="bounds">
                   {this.state.courses.map( course => {
                       <div class="grid-33" key={course.id}> 
                            <Link className="course--module course--link" to="{`/courses/${course.id}">
                                <h4 class="course--label">Course</h4>
                                <h3 class="course--title">{course.title}</h3>
                            </Link>
                       </div>
                   })};

                    <div class="grid-33">
                        <Link class="course--module course--add--module" href="/courses/create">
                            <h3 class="course--add--title">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                                    <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                                </svg>
                                New Course
                            </h3>
                        </Link>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

module.exports = Courses;