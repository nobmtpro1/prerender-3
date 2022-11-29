import * as actions from './types';
// import { loginService } from './service';

// export function loginAction(): actions.LoginAction {
//   return {
//     type: actions.LOGIN,
//   };
// }

export function logoutActions(): actions.LogoutAction {
  return {
    type: actions.LOGOUT,
  };
}
export function loginActions(payload: any): actions.LoginAction {
  return {
    type: actions.LOGIN,
    payload,
  };
}
export function loginWithFacebookActions(payload: any): actions.LoginWithFacebookAction {
  return {
    type: actions.LOGIN_WITH_FACEBOOK,
    payload,
  };
}
export function loginWithInstagramActions(payload: any): actions.LoginWithInstagramAction {
  return {
    type: actions.LOGIN_WITH_INSTAGRAM,
    payload,
  };
}
export function loginWithGoogleActions(payload: any): actions.LoginWithGoogleAction {
  return {
    type: actions.LOGIN_WITH_GOOGLE,
    payload,
  };
}
export function loginSuccessActions(payload: any): actions.LoginSuccessAction {
  return {
    type: actions.LOGIN_SUCCESS,
    payload,
  };
}

export function verificationSuccessActions(payload: any): actions.VerificationSuccessAction {
  return {
    type: actions.VERIFICATION_SUCCESS,
    payload,
  };
}

export function loginFailActions(): actions.LoginFailAction {
  return {
    type: actions.LOGIN_FAIL,
  };
}

export function loginFailUnverifiedActions(): actions.LoginFailUnverifiedAction {
  return {
    type: actions.LOGIN_FAIL_UNVERIFIED,
  };
}

export function LoginFailUnverifiedSmsActions(): actions.LoginFailUnverifiedSmsAction {
  return {
    type: actions.LOGIN_FAIL_UNVERIFIED_SMS,
  };
}

export function sendVerificationLinkAction(): actions.SendVerificationLinkAction {
  return {
    type: actions.SEND_VERIFICATION_LINK,
  };
}

export function registerActions(payload: any): actions.RegisterAction {
  return {
    type: actions.REGISTER,
    payload,
  };
}

export function registerSuccessActions(): actions.RegisterSuccessAction {
  return {
    type: actions.REGISTER_SUCCESS,
  };
}

export function registerGuestActions(payload: any): actions.RegisterGuestAction {
  return {
    type: actions.REGISTER_GUEST,
    payload,
  };
}

export function registerGuestSuccessActions(payload: any): actions.RegisterGuestSuccessAction {
  return {
    type: actions.REGISTER_GUEST_SUCCESS,
    payload,
  };
}

export function toggleModalLoginActions(payload: any): actions.ToggleModalLoginAction {
  return {
    type: actions.TOGGLE_MODAL_LOGIN,
    payload,
  };
}

export function addAddressActions(payload: any): actions.AddAddressAction {
  return {
    type: actions.ADD_ADDRESS,
    payload,
  };
}

export function updateAddressActions(payload: any): actions.UpdateAddressAction {
  return {
    type: actions.UPDATE_ADDRESS,
    payload,
  };
}

export function deleteAddressActions(payload: any): actions.DeleteAddressAction {
  return {
    type: actions.DELETE_ADDRESS,
    payload,
  };
}

export function getAddressActions(payload: any): actions.GetAddressAction {
  return {
    type: actions.GET_ADDRESS,
    payload,
  };
}

export function getAddressBillingActions(payload: any): actions.GetAddressBillingAction {
  return {
    type: actions.GET_ADDRESS_BILLING,
    payload,
  };
}

export function getAddressBillingSuccessActions(
  payload: any,
): actions.GetAddressBillingSuccessAction {
  return {
    type: actions.GET_ADDRESS_BILLING_SUCCESS,
    payload,
  };
}

export function getAddressBillingFailActions(): actions.GetAddressBillingFailAction {
  return {
    type: actions.GET_ADDRESS_BILLING_FAIL,
  };
}

export function getAddressSuccessActions(payload: any): actions.GetAddressSuccessAction {
  return {
    type: actions.GET_ADDRESS_SUCCESS,
    payload,
  };
}

export function getAddressFailActions(): actions.GetAddressFailAction {
  return {
    type: actions.GET_ADDRESS_FAIL,
  };
}
