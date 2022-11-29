import { all, fork } from 'redux-saga/effects';
import homeSaga from './home/sagas';
import blogsSaga from './blogs/sagas';
import productSaga from './product/sagas';
import AuthSaga from './auth/sagas';

export default function* rootSaga() {
  yield all([fork(AuthSaga), fork(homeSaga), fork(blogsSaga), fork(productSaga)]);
}
