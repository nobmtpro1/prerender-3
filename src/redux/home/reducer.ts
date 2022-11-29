import * as actions from './types';

export interface HomeState {
  isOpenModalMail: boolean;
  isOpenShoppingBag: boolean;
  globalHeaderMessage: string;
}

const initialState: HomeState = {
  isOpenModalMail: false,
  isOpenShoppingBag: false,
  globalHeaderMessage: '',
};

export default function homeReducer(
  state: HomeState = initialState,
  action: actions.HomeAction,
): HomeState {
  switch (action.type) {
    case actions.SET_MODAL_MAIL_SUCCESS:
      return {
        ...state,
        isOpenModalMail: action.payload.model,
      };

    case actions.TOGGLE_SHOPPING_BAG_SUCCESS:
      return {
        ...state,
        isOpenShoppingBag: action.payload.model,
      };
    case actions.SET_GLOBAL_HEADER_MESSAGE_SUCCESS:
      return {
        ...state,
        globalHeaderMessage: action.payload.headerMessage,
      };
    default:
      return state;
  }
}
