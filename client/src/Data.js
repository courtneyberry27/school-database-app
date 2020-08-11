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

  async getCourse() {
    const response = await this.api('/courses', 'GET',);
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 404) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  async courseDetail(id) {
    const response = await this.api(`/courses/${id}`, 'GET',);
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 404) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  async createCourse(course, emailAddress, password) {
    const response = await this.api('/courses/', 'POST', course, true, {emailAddress, password});
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  async updateCourse(id, course, emailAddress, password) {
    const response = await this.api(`/courses/${id}`, 'PUT', course, true, {emailAddress, password});
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 400 || response.status === 401 || response.status === 403) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  async deleteCourse(id, emailAddress, password) {
    const response = await this.api(`/courses/${id}`, 'DELETE', null, true, {emailAddress, password});
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 403) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }
}