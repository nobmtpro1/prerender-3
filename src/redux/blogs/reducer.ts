import * as actions from './types';

export interface BlogsState {
  blogsList: any;
}

const initialState: BlogsState = {
  blogsList: null,
};

export default function blogsReducer(
  state: BlogsState = initialState,
  action: actions.BlogsAction,
): BlogsState {
  switch (action.type) {
    case actions.GET_ALL_BLOGS_LIST_SUCCESS:
      return {
        ...state,
        blogsList: action.payload,
      };
    default:
      return state;
  }
}
