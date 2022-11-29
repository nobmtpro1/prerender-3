import { all, fork, put, call, take, takeLatest } from 'redux-saga/effects';
import { fetchBlogList, fetchBlogListFilterTag } from './service';
import * as actionCreators from './actions';
import * as actions from './types';

function* getBlogsListSaga() {
  yield takeLatest(actions.GET_ALL_BLOGS_LIST, function* () {
    try {
      const { data } = yield call(fetchBlogList);
      yield put(actionCreators.getBlogsListSuccess(data.data));
    } catch (error) {
      yield put(actionCreators.getBlogsListFailure(error.response.data.error));
    }
  });
}

function* getBlogsListFilterTagSaga() {
  while (true) {
    try {
      const { payload } = yield take(actions.GET_BLOGS_LIST_FILTER_TAG);
      const { data } = yield call(fetchBlogListFilterTag, payload);
      yield put(actionCreators.getBlogsListSuccess(data.data));
    } catch (error) {
      yield put(actionCreators.getBlogsListFailure(error.response.data.error));
    }
  }
}

export default function* BlogsSaga() {
  yield all([fork(getBlogsListSaga), fork(getBlogsListFilterTagSaga)]);
}
