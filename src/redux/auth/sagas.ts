/* eslint-disable */
import { all, fork, call, put, takeEvery } from 'redux-saga/effects';
import {
  loginService,
  registerService,
  getAddressService,
  addAddressService,
  deleteAddressService,
  updateAddressService,
  logoutService,
  loginWithFacebookService,
  loginWithInstagramService,
  loginWithGoogleService,
  sendVerificationLinkService,
  sendVerifySmsCodeService,
} from './service';
import * as actionCreatorsProduct from '../product/actions';
import Cookies from '../Helpers/cookies';
import * as actionCreators from './actions';
import * as actions from './types';
import * as actionsProduct from '../product/actions';
import { fetchClient, toastrSuccess } from '../Helpers/index';
import { CHECKOUT_ENDPOINT } from '../../config';

function* loginSaga() {
  yield takeEvery(actions.LOGIN, function* (payload) {
    try {
      const { data } = yield call(loginService, payload);
      console.log(data);
      if (!data?.verified && data?.sms) {
        yield call(sendVerifySmsCodeService, payload);
        yield put(actionCreators.LoginFailUnverifiedSmsActions());
      } else if ((!data?.verified && !data?.sms) || !data?.data?.verified_email) {
        yield call(sendVerificationLinkService, payload);
        yield put(actionCreators.loginFailUnverifiedActions());
      }
      const COOKIE_TOKEN = data?.data?.token;
      if (COOKIE_TOKEN) {
        Cookies.set('token', `${COOKIE_TOKEN}`);
        localStorage.setItem('sundoraToken', COOKIE_TOKEN);
        localStorage.removeItem('id_checkout');
        localStorage.removeItem('sundora_guest_id');
        localStorage.setItem('id_checkout', data.data.draft_order_id);
        yield put(actionCreators.loginSuccessActions(data.data));
        yield put(actionCreatorsProduct.getCheckoutProduct());
        yield put(actionCreators.toggleModalLoginActions(false));
        document.location.reload();
      }
    } catch (error) {
      yield put(actionCreators.loginFailActions());
    }
  });
}

function* verificationSuccessSaga() {
  yield takeEvery(actions.VERIFICATION_SUCCESS, function* (payload: any) {
    try {
      const COOKIE_TOKEN = payload?.payload?.token;
      if (COOKIE_TOKEN) {
        Cookies.set('token', `${COOKIE_TOKEN}`);
        localStorage.setItem('sundoraToken', COOKIE_TOKEN);
        localStorage.removeItem('id_checkout');
        localStorage.setItem('id_checkout', payload?.payload?.draft_order_id);
        yield put(actionCreators.loginSuccessActions(payload?.payload));
        yield put(actionCreatorsProduct.getCheckoutProduct());
        yield put(actionCreators.toggleModalLoginActions(false));
        document.location.reload();
      }
    } catch (error) {
      yield put(actionCreators.loginFailActions());
    }
  });
}

function* loginWithFacebookSaga() {
  yield takeEvery(actions.LOGIN_WITH_FACEBOOK, function* (payload) {
    try {
      const { data } = yield call(loginWithFacebookService, payload);
      const COOKIE_TOKEN = data.data.token;
      if (COOKIE_TOKEN) {
        Cookies.set('token', `${COOKIE_TOKEN}`);
        localStorage.setItem('sundoraToken', COOKIE_TOKEN);
        localStorage.removeItem('id_checkout');
        localStorage.setItem('id_checkout', data.data.draft_order_id);
        yield put(actionCreators.loginSuccessActions(data.data));
        yield put(actionCreatorsProduct.getCheckoutProduct());
        yield put(actionCreators.toggleModalLoginActions(false));
        document.location.reload();
      }
    } catch (error) {
      yield put(actionCreators.loginFailActions());
    }
  });
}

function* loginWithInstagramSaga() {
  yield takeEvery(actions.LOGIN_WITH_INSTAGRAM, function* (payload) {
    try {
      const { data } = yield call(loginWithInstagramService, payload);
      const COOKIE_TOKEN = data.data.token;
      if (COOKIE_TOKEN) {
        Cookies.set('token', `${COOKIE_TOKEN}`);
        localStorage.setItem('sundoraToken', COOKIE_TOKEN);
        localStorage.removeItem('id_checkout');
        localStorage.setItem('id_checkout', data.data.draft_order_id);
        yield put(actionCreators.loginSuccessActions(data.data));
        yield put(actionCreatorsProduct.getCheckoutProduct());
        yield put(actionCreators.toggleModalLoginActions(false));
        document.location.reload();
      }
    } catch (error) {
      yield put(actionCreators.loginFailActions());
    }
  });
}

function* loginWithGoogleSaga() {
  yield takeEvery(actions.LOGIN_WITH_GOOGLE, function* (payload) {
    try {
      const { data } = yield call(loginWithGoogleService, payload);
      const COOKIE_TOKEN = data.data.token;
      if (COOKIE_TOKEN) {
        Cookies.set('token', `${COOKIE_TOKEN}`);
        localStorage.setItem('sundoraToken', COOKIE_TOKEN);
        localStorage.removeItem('id_checkout');
        localStorage.setItem('id_checkout', data.data.draft_order_id);
        yield put(actionCreators.loginSuccessActions(data.data));
        yield put(actionCreatorsProduct.getCheckoutProduct());
        yield put(actionCreators.toggleModalLoginActions(false));
        document.location.reload();
      }
    } catch (error) {
      yield put(actionCreators.loginFailActions());
    }
  });
}

function* logoutSaga() {
  yield takeEvery(actions.LOGOUT, function* () {
    // try {
    const { success } = yield call(logoutService);
    if (success) {
      localStorage.removeItem('id_checkout');
      localStorage.removeItem('sundoraToken');
      Cookies.remove('token');
      document.location.href = '/';
    }
    // } catch (error) { }
  });
}

function* registerSaga() {
  yield takeEvery(actions.REGISTER, function* (payload) {
    try {
      const { _, withTimeout } = yield call(registerService, payload);
      // const COOKIE_TOKEN = data.token;
      // if (COOKIE_TOKEN) {
      //   document.cookie = `token=${COOKIE_TOKEN}`;
      //   localStorage.setItem('sundoraToken', COOKIE_TOKEN);
      //   yield put(actionCreators.loginSuccessActions(data));
      //   if (!withTimeout) yield put(actionCreators.toggleModalLoginActions(false));
      // }
      // if (!withTimeout) window.location.reload();
      yield put(actionCreators.registerSuccessActions());
    } catch (error) {
      yield put(actionCreators.loginFailActions());
    }
  });
}

function* registerGuestSaga() {
  yield takeEvery(actions.REGISTER_GUEST, function* (payload) {
    try {
      const { data } = yield call(registerService, payload);
      // const COOKIE_TOKEN = data.token;
      const ID = data.id;
      if (ID) {
        // document.cookie = `token=${COOKIE_TOKEN}`;
        // localStorage.setItem('sundoraToken', COOKIE_TOKEN);
        // yield put(actionCreators.registerGuestSuccessActions(data));
        document.cookie = `sundora_guest_id=${ID}`;
        localStorage.setItem('sundora_guest_id', ID);
        yield put(actionCreators.registerGuestSuccessActions(data));

        // Cookies.set('token', `${COOKIE_TOKEN}`);
        // localStorage.setItem('sundoraToken', COOKIE_TOKEN);
        // localStorage.removeItem('id_checkout');
        // localStorage.setItem('id_checkout', data.data.draft_order_id);

        // yield put(actionCreatorsProduct.getCheckoutProduct());
      }
      // window.location.reload();
    } catch (error) {
      yield put(actionCreators.loginFailActions());
    }
  });
}

function* getAddressSaga() {
  yield takeEvery(actions.GET_ADDRESS, function* (payload: any) {
    try {
      const { data } = yield call(getAddressService, payload?.payload);
      if (payload?.payload == 'billing') {
        yield put(actionCreators.getAddressBillingSuccessActions(data));
      } else {
        yield put(actionCreators.getAddressSuccessActions(data));
      }
    } catch (error) {
      yield put(actionCreators.getAddressFailActions());
    }
  });
}

function* addAddressSaga() {
  yield takeEvery(actions.ADD_ADDRESS, function* (payload: any) {
    try {
      const isCheckout = payload?.payload?.isCheckoutForm;
      const { data } = yield call(addAddressService, payload);
      if (data) {
        toastrSuccess('Add address success');
        if (payload?.payload?.type == 'billing') {
          yield put(actionCreators.getAddressBillingSuccessActions(data));
          yield put(
            actionsProduct.setPlaceOrderForm({
              address_billing_id: data[0].id,
              store_location_id: null,
            }),
          );
        } else {
          yield put(actionCreators.getAddressSuccessActions(data));
          if (isCheckout) {
            const { response } = yield call(updateCheckout, data, null);
            yield put(actionsProduct.checkoutProductSuccess(response));
          }
          yield put(
            actionsProduct.setPlaceOrderForm({
              address_id: data[0].id,
              store_location_id: null,
            }),
          );
        }
      }
    } catch (error) {
      yield put(actionCreators.getAddressFailActions());
    }
  });
}

const updateCheckout = async (data: any, id: any) => {
  try {
    const idCheckout = localStorage.getItem('id_checkout');
    const guestId = localStorage.getItem('sundora_guest_id');
    const options: any = {
      url: `${CHECKOUT_ENDPOINT}${idCheckout}/shipping_address/`,
      method: 'PUT',
      body: {
        user_address_id: id ? id : data[0].id,
        company: '',
      },
    };
    if (guestId) {
      options.body.user_id = parseInt(guestId);
    }
    const response = await fetchClient(options);
    return { response: response.data };
  } catch (err) {
    throw new Error(err);
  }
};

function* updateAddressSaga() {
  yield takeEvery(actions.UPDATE_ADDRESS, function* (payload: any) {
    try {
      const { data } = yield call(updateAddressService, payload);
      const isCheckout = payload?.payload?.isCheckoutForm;
      if (data) {
        if (payload?.payload?.type == 'billing') {
          yield put(
            actionsProduct.setPlaceOrderForm({
              address_billing_id: payload?.payload?.id,
              store_location_id: null,
            }),
          );
          yield put(actionCreators.getAddressBillingSuccessActions(data));
        } else {
          yield put(actionCreators.getAddressSuccessActions(data));
          if (isCheckout) {
            const { response } = yield call(updateCheckout, data, payload?.payload?.id);
            yield put(actionsProduct.checkoutProductSuccess(response));
          }
          yield put(
            actionsProduct.setPlaceOrderForm({
              address_id: payload?.payload?.id,
              store_location_id: null,
            }),
          );
        }
      }
    } catch (error) {
      yield put(actionCreators.getAddressFailActions());
    }
  });
}

function* deleteAddressSaga() {
  yield takeEvery(actions.DELETE_ADDRESS, function* (payload: any) {
    try {
      const { data } = yield call(deleteAddressService, payload);
      if (data) {
        const { data } = yield call(
          getAddressService,
          payload?.payload?.type ? payload?.payload?.type : 'shipping',
        );
        toastrSuccess('Delete success');
        if (payload?.payload?.type == 'billing') {
          yield put(actionCreators.getAddressBillingSuccessActions(data));
        } else {
          yield put(actionCreators.getAddressSuccessActions(data));
        }
      }
    } catch (error) {
      yield put(actionCreators.getAddressFailActions());
    }
  });
}

export default function* AuthSaga() {
  yield all([
    fork(loginSaga),
    fork(loginWithFacebookSaga),
    fork(loginWithInstagramSaga),
    fork(loginWithGoogleSaga),
    fork(registerSaga),
    fork(getAddressSaga),
    fork(addAddressSaga),
    fork(deleteAddressSaga),
    fork(updateAddressSaga),
    fork(logoutSaga),
    fork(verificationSuccessSaga),
    fork(registerGuestSaga),
  ]);
}
/* eslint-disable */
