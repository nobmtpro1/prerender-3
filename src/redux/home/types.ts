// export const GET_SONGS = 'GET_SONGS';
// export interface GetSongsAction {
//   type: typeof GET_SONGS;
//   payload: any;
//   callSuccess: ICbSuccess;
//   callError: ICbFailure;
// }

// export const GET_SONGS_SUCCESS = 'GET_SONGS_SUCCESS';
// export interface GetSongsSuccessAction {
//   type: typeof GET_SONGS_SUCCESS;
//   payload: any;
// }
// export const GET_SONGS_FAILURE = 'GET_SONGS_FAILURE';
// export interface GetSongsFailureAction {
//   type: typeof GET_SONGS_FAILURE;
//   error: Error | string;
// }
export const SET_MODAL_MAIL = 'SET_MODAL_MAIL';
export interface SetModalMailAction {
  type: typeof SET_MODAL_MAIL;
  payload: any;
}

export const SET_MODAL_MAIL_SUCCESS = 'SET_MODAL_MAIL_SUCCESS';
export interface SetModalMailSuccessAction {
  type: typeof SET_MODAL_MAIL_SUCCESS;
  payload: any;
}

export const TOGGLE_SHOPPING_BAG = 'TOGGLE_SHOPPING_BAG';
export interface ToggleShoppingBagAction {
  type: typeof TOGGLE_SHOPPING_BAG;
  payload: any;
}

export const TOGGLE_SHOPPING_BAG_SUCCESS = 'TOGGLE_SHOPPING_BAG_SUCCESS';
export interface ToggleShoppingBagSuccessAction {
  type: typeof TOGGLE_SHOPPING_BAG_SUCCESS;
  payload: any;
}

export const SET_GLOBAL_HEADER_MESSAGE = 'SET_GLOBAL_HEADER_MESSAGE';
export interface SetGlobalHeaderMessageAction {
  type: typeof SET_GLOBAL_HEADER_MESSAGE;
  payload: any;
}

export const SET_GLOBAL_HEADER_MESSAGE_SUCCESS = 'SET_GLOBAL_HEADER_MESSAGE_SUCCESS';
export interface SetGlobalHeaderMessageSuccessAction {
  type: typeof SET_GLOBAL_HEADER_MESSAGE_SUCCESS;
  payload: any;
}

export interface ICbSuccess {
  (result?: any): void;
}
export interface ICbFailure {
  (error: Error, result?: any): void;
}

export type HomeAction =
  | SetModalMailAction
  | SetModalMailSuccessAction
  | ToggleShoppingBagAction
  | ToggleShoppingBagSuccessAction
  | SetGlobalHeaderMessageAction
  | SetGlobalHeaderMessageSuccessAction;
