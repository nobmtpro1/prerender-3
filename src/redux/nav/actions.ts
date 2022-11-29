import * as actions from './types';

export function getNavData(data: any): actions.NavDataAction {
  return { type: actions.GET_NAV_DATA, payload: { data } };
}
