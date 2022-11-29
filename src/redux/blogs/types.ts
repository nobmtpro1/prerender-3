export const GET_ALL_BLOGS_LIST = 'GET_ALL_BLOGS_LIST';
export interface GetBlogsListAction {
  type: typeof GET_ALL_BLOGS_LIST;
}

export const GET_ALL_BLOGS_LIST_SUCCESS = 'GET_ALL_BLOGS_LIST_SUCCESS';
export interface GetBlogsListSuccessAction {
  type: typeof GET_ALL_BLOGS_LIST_SUCCESS;
  payload: string;
}

export const GET_ALL_BLOGS_LIST_FAILURE = 'GET_ALL_BLOGS_LIST_FAILURE';
export interface GetBlogsFailureAction {
  type: typeof GET_ALL_BLOGS_LIST_FAILURE;
  error: Error | string;
}

export const GET_BLOGS_LIST_FILTER_TAG = 'GET_BLOGS_LIST_FILTER_TAG';
export interface GetBlogsListFilterTagAction {
  type: typeof GET_BLOGS_LIST_FILTER_TAG;
  payload: any;
}

export interface ICbSuccess {
  (result?: any): void;
}
export interface ICbFailure {
  (error: Error, result?: any): void;
}

export type BlogsAction =
  | GetBlogsListAction
  | GetBlogsListSuccessAction
  | GetBlogsFailureAction
  | GetBlogsListFilterTagAction;
