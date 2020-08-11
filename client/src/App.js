//IMPORTS
import React from 'react';
import { 
  BrowserRouter,
  Route,
  Switch
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
import withContext from './Context';

//USE WITH CONTEXT FOR ALL COMPONENTS (WithContext = "WITH CONTEXT")
const HeaderWithContext = withContext(Header);
const CoursesWithContext = withContext(Courses);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignOutWithContext = withContext(UserSignOut);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);

/*************************
 * ROUTES SECTION
 *************************/
export default () => (
  <BrowserRouter>
  <HeaderWithContext />
  <main>
    <Switch>
      <Route exact path="/" component={CoursesWithContext} />
      <Route path="/signup" component={UserSignUpWithContext} />
      <Route path="/signin" component={UserSignInWithContext} />
      <Route path="/signout" component={UserSignOutWithContext} />
      <PrivateRoute exact path="/courses/create" component={CreateCourseWithContext} />
      <PrivateRoute path={`/courses/:id/update`} component={UpdateCourseWithContext} />
      <Route path="/courses/:id" component={CourseDetailWithContext} />
      <Route path="/notfound" component={NotFound} />
      <Route path="/forbidden" component={Forbidden} />
      <Route path="/error" component={UnhandledError} />
      <Route component={NotFound} />
    </Switch>
  </main>
</BrowserRouter>
);