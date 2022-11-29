import * as actions from './types';

export const setModalMail = (model: any): actions.SetModalMailAction => {
  return {
    type: actions.SET_MODAL_MAIL,
    payload: {
      model,
    },
  };
};

export const toggleShoppingbag = (model: any): actions.ToggleShoppingBagAction => {
  document.body.style.overflow = 'hidden';
  return {
    type: actions.TOGGLE_SHOPPING_BAG,
    payload: {
      model,
    },
  };
};

export const setGlobalHeaderMessage = (
  headerMessage: any,
): actions.SetGlobalHeaderMessageSuccessAction => {
  return {
    type: actions.SET_GLOBAL_HEADER_MESSAGE_SUCCESS,
    payload: {
      headerMessage,
    },
  };
};
// export function getSongs(
//   model: any,
//   callSuccess: actions.ICbSuccess,
//   callError: actions.ICbFailure,
// ): actions.GetSongsAction {
//   return {
//     type: actions.GET_SONGS,
//     payload: {
//       model,
//     },
//     callSuccess,
//     callError,
//   };
// }

// export function getSongSuccess(song: string): actions.GetSongsSuccessAction {
//   return {
//     type: actions.GET_SONGS_SUCCESS,
//     song,
//   };
// }

// export function getSongFailure(error: Error | string): actions.GetSongsFailureAction {
//   return {
//     type: actions.GET_SONGS_FAILURE,
//     error,
//   };
// }
