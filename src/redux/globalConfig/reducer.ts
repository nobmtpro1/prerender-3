import * as actions from './actions';

export interface state {
  logo: any;
}
const defaultState: state = {
  logo: null,
};
const initialState: state = JSON.parse(
  localStorage.getItem('globalConfig') || JSON.stringify(defaultState),
);

export default function globalConfigReducer(
  state: state = initialState,
  action: actions.setGlobalConfigActionInterface,
): state {
  switch (action.type) {
    case actions.SET_GLOBAL_CONFIG:
      return {
        ...state,
        ...action?.payload,
      };

    default:
      return state;
  }
}
