import axios from 'axios';
import * as authMutationTypes from './auth-mutation-types';

const state = {
  token: localStorage.getItem('token') || '',
  currentUser: {},
  status: ''
};

const mutations = {
  [authMutationTypes.SET_AUTH_STATUS](state, payload) {
    state.status = payload;
  },
  [authMutationTypes.LOG_OUT](state) {
    state.status = '';
    state.token = '';
  },
  [authMutationTypes.LOG_IN](state, payload) {
    state.status = payload.status;
    state.token = payload.token;
    state.currentUser = payload.user;
  }
};

const actions = {
  login(context, data) {
    return new Promise((resolve, reject) => {
      context.commit(authMutationTypes.SET_AUTH_STATUS, 'loading');
      axios
        .post('http://localhost:3000/api/v1/auth/login', data)
        .then(
          res => {
            console.log(res);
            if (res.data.success) {
              const token = res.data.token;
              const user = res.data.user;
              localStorage.setItem('token', token);
              axios.defaults.headers.common['Authorization'] = token;
              context.commit(authMutationTypes.LOG_IN, {
                token,
                user,
                status: 'success'
              });
              resolve(res.data);
            }
            reject({ message: 'failed' });
          },
          err => {
            if (err.response.data) {
              resolve(err.response.data);
            }
            reject(err);
          }
        )
        .catch(err => {
          console.log(err);
        });
    });
  },
  register(context, data) {
    return new Promise((resolve, reject) => {
      axios
        .post('http://localhost:3000/api/v1/auth/register', data)
        .then(
          res => {
            console.log(res);
            if (res.data.success) {
              resolve(res.data);
            }
          },
          err => {
            console.log(err.response);
            // if (err.response.data) {
            // if (Object.keys(err.response).includes('data')) {
            //   resolve(err.response.data);
            // }
            if (err.response.status === 400) {
              resolve(err.response.data);
            }

            reject(err.response);
          }
        )
        .catch(err => {
          console.log(err);
        });
    });
  }
};

const getters = {
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status
};

const authModule = {
  state,
  mutations,
  actions,
  getters
};

export default authModule;
