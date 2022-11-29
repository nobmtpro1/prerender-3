import { all, fork, put, call, take, takeLatest } from 'redux-saga/effects';
import {
  checkoutProductService,
  getCheckoutProductService,
  deleteCheckoutProductService,
  // sortAllProductService,
} from './service';
import * as actionCreators from './actions';
import * as actions from './types';

function* setCheckoutProductSaga() {
  while (true) {
    try {
      const { payload } = yield take(actions.CHECKOUT_PRODUCT);
      const { data } = yield call(checkoutProductService, payload);
      if (data) {
        yield put(actionCreators.setLineItems(payload));
        if (
          !localStorage.getItem('id_checkout') ||
          localStorage.getItem('id_checkout') == 'null'
        ) {
          localStorage.setItem('id_checkout', data.id);
        }
        yield put(actionCreators.checkoutProductSuccess(data));
      } else {
        yield put(actionCreators.checkoutProductFailure(data?.error));
      }
    } catch (error) {
      yield put(actionCreators.checkoutProductFailure(error));
      console.log(error);
    }
  }
}

function* deleteCheckoutProductSaga() {
  while (true) {
    try {
      const { payload } = yield take(actions.DELETE_LINE_ITEMS);
      yield put(actionCreators.deleteLineItems(payload));
      if (payload.length == 0) {
        yield call(deleteCheckoutProductService, payload);
        yield put(actionCreators.checkoutProductSuccess({}));
        localStorage.removeItem('id_checkout');
        const { data } = yield call(getCheckoutProductService);
        yield put(actionCreators.checkoutProductSuccess(data));
      } else {
        const { data } = yield call(deleteCheckoutProductService, payload);
        if (typeof data != 'undefined') {
          yield put(actionCreators.setLineItems(payload));
          yield put(actionCreators.checkoutProductSuccess(data));
        } else {
          setTimeout(() => document.location.reload(), 3000);
        }
      }
    } catch (error) {
      // yield put(actionCreators.checkoutProductFailure(error));
      console.log(error);
    }
  }
}

function* getCheckoutProductSaga() {
  yield takeLatest(actions.GET_CHECKOUT_PRODUCT, function* () {
    try {
      const { data } = yield call(getCheckoutProductService);

      yield put(actionCreators.setLineItems(data?.line_items));
      yield put(actionCreators.checkoutProductSuccess(data));
    } catch (error) {
      yield put(actionCreators.checkoutProductFailure(error));
      // console.log(error);
    }
  });
}

function* filterPriceProductSaga() {
  // yield takeEvery(actions.FILTER_PRICE_PRODUCT, function* () {
  //   try {
  //     const { data } = yield call(getCheckoutProductService);
  //     yield put(actionCreators.setLineItems(data?.line_items));
  //     yield put(actionCreators.checkoutProductSuccess(data));
  //   } catch (error) {
  //     yield put(actionCreators.checkoutProductFailure(error));
  //     console.log(error);
  //   }
  // });
}
// function* sortAllProductSaga() {
//   while (true) {
//     try {
//       const { payload } = yield take(actions.SORT_ALL_PRODUCT);
//       // const { data } = yield call(sortAllProductService, payload);
//       yield put(actionCreators.sortAllProductSuccess({}));
//       console.log('SORT ALL PRODUCT');
//     } catch (error) {
//       yield put(actionCreators.sortAllProductFailure(error));
//     }
//   }
// }

export default function* ProductSaga() {
  yield all([
    fork(setCheckoutProductSaga),
    fork(getCheckoutProductSaga),
    fork(deleteCheckoutProductSaga),
    // fork(sortAllProductSaga),
    fork(filterPriceProductSaga),
  ]);
}
