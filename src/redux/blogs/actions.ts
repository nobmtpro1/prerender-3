import * as actions from './types';
export function getBlogsList(): actions.GetBlogsListAction {
  return { type: actions.GET_ALL_BLOGS_LIST };
}

export function getBlogsListFilterTag(payload: any): actions.GetBlogsListFilterTagAction {
  return { type: actions.GET_BLOGS_LIST_FILTER_TAG, payload };
}

export function getBlogsListSuccess(payload: any): actions.GetBlogsListSuccessAction {
  return {
    type: actions.GET_ALL_BLOGS_LIST_SUCCESS,
    payload,
  };
}

export function getBlogsListFailure(error: Error | string): actions.GetBlogsFailureAction {
  return {
    type: actions.GET_ALL_BLOGS_LIST_FAILURE,
    error,
  };
}
