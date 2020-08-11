import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthConsumer } from '../Context';

// Individual course buttons on the courses route. Reroutes to the CourseDetail page when clicked.
// Also calls isCourseOwner in the Provider for use in ActionsBar to display the update and delete buttons.
class Course extends Component {
  render() {
    const { id, title, courseUserId } = this.props;

    return (
      <AuthConsumer>
        {({ isCourseOwner }) => (
          <div className="grid-33">
            <NavLink
              to={`courses/${id}`}
              className="course--module course--link"
              onClick={isCourseOwner(courseUserId)}
            >
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{title}</h3>
            </NavLink>
          </div>
        )}
      </AuthConsumer>
    );
  }
}

export default React.memo(Course);