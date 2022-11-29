import axios from 'axios';
import { API_URL } from '../../config';
import { deleteToken } from '../helpers/localStorage';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const {
      response: { status },
    } = error;
    if (status === 401) {
      deleteToken();
      window.location.href = '/';
    }
    // if (status === 403) {
    //   window.location.href = "/403";
    // }
    return Promise.reject(error);
  },
);

api.defaults.headers.common['Authorization'] =
  typeof window !== 'undefined' && localStorage.getItem('USER_TOKEN') != null
    ? `Bearer ${localStorage.getItem('USER_TOKEN')}`
    : null;

export function setAuthorization(token: any) {
  api.defaults.headers.common['Authorization'] = token === null ? token : `Bearer ${token}`;
}

//for Logout
export function removeAuthorization() {
  setAuthorization(null);
}
