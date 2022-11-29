export const GET_NAV_DATA = 'GET_NAV_DATA';

export interface NavDataAction {
  type: typeof GET_NAV_DATA;
  payload: any;
}

export type NavAction = NavDataAction;
