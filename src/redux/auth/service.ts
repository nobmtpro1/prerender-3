import axios from 'axios';
import {
  GET_PAGE_ALL_BLOG_LIST,
  LOGIN,
  REGISTER,
  GET_ADDRESS,
  POST_ADDRESS,
  LOGOUT,
  LOGIN_WITH_FACEBOOK,
  LOGIN_WITH_INSTAGRAM,
  LOGIN_WITH_GOOGLE,
  POST_VERIFICATION_LINK,
  POST_SEND_VERIFY_SMS_CODE,
} from '../../config';
import { fetchClient } from '../Helpers';

interface dataResponse {
  data: any;
}

export async function fetchBlogList(): Promise<dataResponse> {
  return await axios.get(GET_PAGE_ALL_BLOG_LIST);
}

export async function logoutService(): Promise<dataResponse> {
  const options = {
    url: LOGOUT,
    method: 'POST',
    body: null,
  };
  return await fetchClient(options);
}

export async function loginService(data: any): Promise<dataResponse> {
  return await axios.post(LOGIN, data.payload);
}

export async function loginWithFacebookService(data: any): Promise<dataResponse> {
  return await axios.post(LOGIN_WITH_FACEBOOK, data.payload);
}

export async function loginWithInstagramService(data: any): Promise<dataResponse> {
  return await axios.post(LOGIN_WITH_INSTAGRAM, data.payload);
}

export async function loginWithGoogleService(data: any): Promise<dataResponse> {
  return await axios.post(LOGIN_WITH_GOOGLE, data.payload);
}

export async function registerService(data: any): Promise<dataResponse> {
  const options = {
    url: REGISTER,
    method: 'POST',
    body: data.payload,
  };
  return {
    ...(await fetchClient(options)),
    withTimeout: data?.payload?.customer?.withTimeout,
  };
}

export async function getAddressService(type: any): Promise<dataResponse> {
  const options = {
    url: `${GET_ADDRESS}?type=${type ? type : 'shipping'}`,
    method: 'GET',
    body: null,
  };
  return await fetchClient(options);
}

export async function addAddressService(data: any): Promise<dataResponse> {
  const options = {
    url: `${POST_ADDRESS}?type=${data?.payload?.type}`,
    method: 'POST',
    body: data.payload,
  };
  return await fetchClient(options);
}

export async function updateAddressService(data: any): Promise<dataResponse> {
  const options = {
    url: `${POST_ADDRESS}${data.payload.id}/?type=${data?.payload?.type}`,
    method: 'PUT',
    body: data.payload,
  };
  return await fetchClient(options);
}

export async function deleteAddressService(data: any): Promise<dataResponse> {
  const options = {
    url: `${POST_ADDRESS}${data.payload.id}?type=${data?.payload?.type}`,
    method: 'DELETE',
    body: null,
  };
  return await fetchClient(options);
}

export async function sendVerificationLinkService(data: any): Promise<dataResponse> {
  const options = {
    url: POST_VERIFICATION_LINK,
    method: 'POST',
    body: data.payload,
  };
  return await fetchClient(options);
}

export async function sendVerifySmsCodeService(data: any): Promise<dataResponse> {
  const options = {
    url: POST_SEND_VERIFY_SMS_CODE,
    method: 'POST',
    body: data.payload,
  };
  return await fetchClient(options);
}
