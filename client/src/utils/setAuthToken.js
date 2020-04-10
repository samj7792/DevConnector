import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    // set global header x-auth-token to the token if it is valid
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
