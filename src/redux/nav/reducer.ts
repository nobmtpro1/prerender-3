import * as actions from './types';

export interface NavState {
  body: any;
  basic_settings: any;
  dynamic_links: any;
  featured_image: string;
  form_fields: any;
  highlight_message: any;
  meta: any;
  redirect_url?: string;
  title?: string;
  timestamp?: Date | string;
}

const initialState: NavState = {
  body: [],
  basic_settings: {},
  dynamic_links: {},
  featured_image: '',
  form_fields: {},
  highlight_message: {},
  meta: {},
};

export default function navReducer(
  state: NavState = initialState,
  action: actions.NavAction,
): NavState {
  switch (action.type) {
    case actions.GET_NAV_DATA:
      const {
        body,
        dynamic_links,
        featured_image,
        form_fields,
        highlight_message,
        meta,
        redirect_url,
        timestamp,
        title,
        basic_settings,
      } = action.payload.data;
      return {
        ...state,
        body,
        dynamic_links,
        featured_image,
        form_fields,
        highlight_message,
        meta,
        redirect_url,
        timestamp,
        title,
        basic_settings,
      };

    default:
      return state;
  }
}
