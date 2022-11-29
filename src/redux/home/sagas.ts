import { all, fork, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from './types';

// function* getSongsSaga() {
//   yield takeEvery(
//     actionTypes.GET_SONGS,
//     function* ({ payload, callSuccess, callError }: actionTypes.GetSongsAction) {
//       const { model } = payload;
//       try {
//         if (model?.artist)
//           yield put({
//             type: actionTypes.GET_SONGS_SUCCESS,
//             payload: { model },
//           });
//         yield callSuccess();
//       } catch (error) {
//         yield callError(error);
//         yield put({ type: actionTypes.GET_SONGS_FAILURE });
//       }
//     },
//   );
// }

export function* setModalMailSaga() {
  yield takeLatest(actionTypes.SET_MODAL_MAIL, function* ({ payload }: any) {
    const { model } = payload;
    try {
      if (payload)
        yield put({
          type: actionTypes.SET_MODAL_MAIL_SUCCESS,
          payload: { model },
        });
    } catch (error) {
      console.log(error);
    }
  });
}

export function* toggleShoppingBagSaga() {
  yield takeLatest(actionTypes.TOGGLE_SHOPPING_BAG, function* ({ payload }: any) {
    const { model } = payload;
    try {
      if (payload)
        yield put({
          type: actionTypes.TOGGLE_SHOPPING_BAG_SUCCESS,
          payload: { model },
        });
    } catch (error) {
      console.log(error);
    }
  });
}

export function* changeHeaderMessageSaga() {
  yield takeLatest(actionTypes.SET_GLOBAL_HEADER_MESSAGE, function* ({ payload }: any) {
    const { headerMessage } = payload;
    try {
      if (payload)
        yield put({
          type: actionTypes.SET_GLOBAL_HEADER_MESSAGE_SUCCESS,
          payload: { headerMessage },
        });
    } catch (error) {
      console.log(error);
    }
  });
}

export default function* homeSaga() {
  yield all([
    fork(setModalMailSaga),
    fork(toggleShoppingBagSaga),
    fork(changeHeaderMessageSaga),
  ]);
}
