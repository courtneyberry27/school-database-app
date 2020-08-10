import config from './config';

// methods for fetching data from REST API
export default class Data {
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);

      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  readResponse(response, errorMessage) {
    
    switch (response.status) {
      // OK
      case 200: return response.json().then(data => data);
      // Created
      case 201: return { location: response.headers.get('location') }
      // Success, no content
      case 204: return 'success';
      // Bad request
      case 400: return response.json().then(data => data );
      // Not authorized
      case 401: return null;
      // Forbidden
      case 403: throw new Error('403');
      // Not found
      case 404: throw new Error('404');
      // Server error
      case 500: throw new Error('500');
      default:
        // Just in case, outlier for whatever hasn't been accounted for.
        throw new Error(errorMessage);
    }
  }  

/*****************************
 * USERS FUNCTIONS
 *****************************/
  getUser = async (username, password) => {
    const response = await this.api('/users', 'GET', null, true, { username, password });
    // possible responses 200, 401, 500
    return this.readResponse(response, `error in getUser: ${username}`);
  }
  
  createUser = async (user) => {
    const response = await this.api('/users', 'POST', user);
    // possible responses 201, 400, 500
    return this.readResponse(response, `error in createUser: ${user}`);
  }
 
/*****************************
 * COURSES FUNCTIONS
 *****************************/
  getCourses = async () => {
    const response = await this.api('/courses');
    // possible responses 200, 500
    return this.readResponse(response, 'error in getCourses');
  }

  getCourse = async (id) => {
    const response = await this.api('/courses/' + id);
    // possible responses 200, 404, 500
    return this.readResponse(response, `error in getCourse, id: ${id}`);
  }

  createCourse = async (username, password, course) => {
    const response = await this.api('/courses/', 'POST', course, true, { username, password });
    // possible responses 201, 400, 401, 500
    return this.readResponse(response, `error in postCourse, data: ${course}`);
  }

  updateCourse = async (username, password, course) => {
    const response = await this.api(`/courses/${course.id}`, 'PUT', course, true, { username, password });
    // possible responses 204, 400, 401, 403, 500
    return this.readResponse(response, `error in putCourse, data: ${course}`);
  }

  deleteCourse = async (username, password, id) => {
    const response = await this.api(`/courses/${id}`, 'DELETE', null , true, { username, password });
    // possible responses 204, 401, 403, 500
    return this.readResponse(response, `error in getCourse, id: ${id}`);
  }
}