//IMPORTS
import React, { Component } from 'react';
import { 
  BrowserRouter,
  Route,
  Switch, 
  Redirect
} from 'react-router-dom';

//FILE IMPORTS
import Header from './components/Header'
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import NotFound from './components/NotFound';
import Courses from './components/Courses'
import PrivateRoute  from './PrivateRoute';
import UnhandledError from './components/UnhandledError'
import Forbidden from './components/Forbidden'

//WITH CONTEXT IMPORT
import { AuthProvider } from './Context';

// //USE WITH CONTEXT FOR ALL COMPONENTS (WithContext = "WITH CONTEXT")
// const HeaderWithContext = withContext(Header);
// const CoursesWithContext = withContext(Courses);
// const UserSignInWithContext = withContext(UserSignIn);
// const UserSignUpWithContext = withContext(UserSignUp);
// const UserSignOutWithContext = withContext(UserSignOut);
// const CourseDetailWithContext = withContext(CourseDetail);
// const CreateCourseWithContext = withContext(CreateCourse);
// const UpdateCourseWithContext = withContext(UpdateCourse);

/*************************
 * ROUTES SECTION
 *************************/
class App extends Component {
  render() {
    return (
      <div className="root">
        <div>
          <AuthProvider>
            <Header />
            <Switch>
              <Route exact path="/" component={Courses} />
              <PrivateRoute
                exact
                path="/courses/:id/update"
                component={UpdateCourse}
              />
              <PrivateRoute
                exact
                path="/courses/create"
                component={CreateCourse}
              />
              <Route exact path="/courses/:id" component={CourseDetail} />
              <Route exact path="/signin" component={UserSignIn} />
              <Route exact path="/signup" component={UserSignUp} />
              <Route exact path="/signout" component={UserSignOut} />
              <Route exact path="/forbidden" component={Forbidden} />
              <Route exact path="/notfound" component={NotFound} />
              <Route exact path="/error" component={UnhandledError} />
              <Route render={() => <Redirect to="/notfound" />} />
            </Switch>
          </AuthProvider>
        </div>
      </div>
    );
  }
}

export default App;