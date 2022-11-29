export const REGISTER = 'REGISTER';
export interface RegisterAction {
  type: typeof REGISTER;
  payload: any;
}

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
}

export const REGISTER_GUEST = 'REGISTER_GUEST';
export interface RegisterGuestAction {
  type: typeof REGISTER_GUEST;
  payload: any;
}

export const REGISTER_GUEST_SUCCESS = 'REGISTER_GUEST_SUCCESS';
export interface RegisterGuestSuccessAction {
  type: typeof REGISTER_GUEST_SUCCESS;
  payload: any;
}

export const LOGOUT = 'LOGOUT';
export interface LogoutAction {
  type: typeof LOGOUT;
}

export const LOGIN = 'LOGIN';
export interface LoginAction {
  type: typeof LOGIN;
  payload: any;
}

export const LOGIN_WITH_FACEBOOK = 'LOGIN_WITH_FACEBOOK';
export interface LoginWithFacebookAction {
  type: typeof LOGIN_WITH_FACEBOOK;
  payload: any;
}

export const LOGIN_WITH_INSTAGRAM = 'LOGIN_WITH_INSTAGRAM';
export interface LoginWithInstagramAction {
  type: typeof LOGIN_WITH_INSTAGRAM;
  payload: any;
}

export const LOGIN_WITH_GOOGLE = 'LOGIN_WITH_GOOGLE';
export interface LoginWithGoogleAction {
  type: typeof LOGIN_WITH_GOOGLE;
  payload: any;
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: any;
}

export const LOGIN_FAIL = 'LOGIN_FAIL';
export interface LoginFailAction {
  type: typeof LOGIN_FAIL;
}

export const LOGIN_FAIL_UNVERIFIED = 'LOGIN_FAIL_UNVERIFIED';
export interface LoginFailUnverifiedAction {
  type: typeof LOGIN_FAIL_UNVERIFIED;
}

export const LOGIN_FAIL_UNVERIFIED_SMS = 'LOGIN_FAIL_UNVERIFIED_SMS';
export interface LoginFailUnverifiedSmsAction {
  type: typeof LOGIN_FAIL_UNVERIFIED_SMS;
}

export const SEND_VERIFICATION_LINK = 'SEND_VERIFICATION_LINK';
export interface SendVerificationLinkAction {
  type: typeof SEND_VERIFICATION_LINK;
}

export const VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS';
export interface VerificationSuccessAction {
  type: typeof VERIFICATION_SUCCESS;
  payload: any;
}

export const GET_USER_INFO = 'GET_USER_INFO';

export interface GetUserInfoAction {
  type: typeof GET_USER_INFO;
  payload: any;
}

export const TOGGLE_MODAL_LOGIN = 'TOGGLE_MODAL_LOGIN';
export interface ToggleModalLoginAction {
  type: typeof TOGGLE_MODAL_LOGIN;
  payload: any;
}

// export const GET_ALL_BLOGS_LIST_SUCCESS = 'GET_ALL_BLOGS_LIST_SUCCESS';
// export interface GetBlogsListSuccessAction {
//   type: typeof GET_ALL_BLOGS_LIST_SUCCESS;
//   payload: string;
// }

export const ADD_ADDRESS = 'ADD_ADDRESS';
export interface AddAddressAction {
  type: typeof ADD_ADDRESS;
  payload: any;
}

export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export interface UpdateAddressAction {
  type: typeof UPDATE_ADDRESS;
  payload: any;
}

export const DELETE_ADDRESS = 'DELETE_ADDRESS';
export interface DeleteAddressAction {
  type: typeof DELETE_ADDRESS;
  payload: any;
}

export const GET_ADDRESS = 'GET_ADDRESS';
export interface GetAddressAction {
  type: typeof GET_ADDRESS;
  payload: any;
}

export const GET_ADDRESS_BILLING = 'GET_ADDRESS_BILLING';
export interface GetAddressBillingAction {
  type: typeof GET_ADDRESS_BILLING;
  payload: any;
}

export const GET_ADDRESS_BILLING_SUCCESS = 'GET_ADDRESS_BILLING_SUCCESS';
export interface GetAddressBillingSuccessAction {
  type: typeof GET_ADDRESS_BILLING_SUCCESS;
  payload: any;
}

export const GET_ADDRESS_BILLING_FAIL = 'GET_ADDRESS_BILLING_FAIL';
export interface GetAddressBillingFailAction {
  type: typeof GET_ADDRESS_BILLING_FAIL;
}

export const GET_ADDRESS_SUCCESS = 'GET_ADDRESS_SUCCESS';
export interface GetAddressSuccessAction {
  type: typeof GET_ADDRESS_SUCCESS;
  payload: any;
}

export const GET_ADDRESS_FAIL = 'GET_ADDRESS_FAIL';
export interface GetAddressFailAction {
  type: typeof GET_ADDRESS_FAIL;
}

export interface ICbSuccess {
  (result?: any): void;
}
export interface ICbFailure {
  (error: Error, result?: any): void;
}

export type AuthAction =
  | LoginAction
  | LoginSuccessAction
  | LoginFailAction
  | LoginFailUnverifiedAction
  | LoginFailUnverifiedSmsAction
  | ToggleModalLoginAction
  | RegisterAction
  | GetAddressAction
  | GetAddressSuccessAction
  | GetAddressFailAction
  | AddAddressAction
  | DeleteAddressAction
  | UpdateAddressAction
  | LogoutAction
  | GetAddressBillingAction
  | GetAddressBillingSuccessAction
  | GetAddressBillingFailAction
  | SendVerificationLinkAction
  | VerificationSuccessAction
  | RegisterGuestAction
  | RegisterGuestSuccessAction
  | RegisterSuccessAction;
