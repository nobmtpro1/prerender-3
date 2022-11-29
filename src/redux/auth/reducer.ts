import * as actions from './types';

export interface UserState {
  user: any;
  loginRequestStatus: any;
  modalLogin: boolean;
  address: any;
}

const initialState: UserState = {
  user: null,
  loginRequestStatus: {
    inProgress: false,
    error: false,
    exists: false,
    email_verified: false,
    sms_verified: false,
    new_register: false,
  },
  address: {
    shipping: [],
    billing: [],
  },
  modalLogin: false,
};

export default function userReducer(
  state: UserState = initialState,
  action: actions.AuthAction,
): UserState {
  switch (action.type) {
    case actions.LOGIN:
      return {
        ...state,
        user: null,
        loginRequestStatus: {
          inProgress: true,
          error: false,
        },
      };
    case actions.REGISTER:
      return {
        ...state,
        user: null,
        loginRequestStatus: {
          inProgress: true,
          error: false,
        },
      };
    case actions.REGISTER_SUCCESS:
      return {
        ...state,
        user: null,
        loginRequestStatus: {
          inProgress: false,
          error: false,
          email_verified: false,
          new_register: true,
        },
      };
    case actions.REGISTER_GUEST:
      return {
        ...state,
        user: null,
        loginRequestStatus: {
          inProgress: true,
          error: false,
        },
      };
    case actions.REGISTER_GUEST_SUCCESS:
      return {
        ...state,
        // user: action.payload,
        loginRequestStatus: {
          inProgress: false,
          error: false,
        },
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loginRequestStatus: {
          inProgress: false,
          error: false,
          exists: true,
          email_verified: true,
          sms_verified: true,
        },
      };
    case actions.VERIFICATION_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loginRequestStatus: {
          inProgress: false,
          error: false,
          exists: true,
          email_verified: true,
        },
      };
    case actions.LOGIN_FAIL:
      return {
        ...state,
        loginRequestStatus: {
          inProgress: false,
          error: true,
          exists: false,
          email_verified: false,
        },
      };
    case actions.LOGIN_FAIL_UNVERIFIED:
      return {
        ...state,
        loginRequestStatus: {
          inProgress: false,
          error: true,
          exists: true,
          email_verified: false,
        },
      };
    case actions.LOGIN_FAIL_UNVERIFIED_SMS:
      return {
        ...state,
        loginRequestStatus: {
          inProgress: false,
          error: true,
          exists: true,
          email_verified: true,
          sms_verified: false,
        },
      };
    case actions.TOGGLE_MODAL_LOGIN:
      return {
        ...state,
        modalLogin: action.payload,
      };
    case actions.GET_ADDRESS_SUCCESS:
      return {
        ...state,
        address: {
          ...state.address,
          shipping: action.payload,
        },
      };
    case actions.GET_ADDRESS_BILLING_SUCCESS:
      return {
        ...state,
        address: {
          ...state.address,
          billing: action.payload,
        },
      };
    default:
      return state;
  }
}
