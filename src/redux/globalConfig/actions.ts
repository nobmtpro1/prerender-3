export const SET_GLOBAL_CONFIG = 'SET_GLOBAL_CONFIG';

export interface setGlobalConfigActionInterface {
  type: typeof SET_GLOBAL_CONFIG;
  payload: any;
}
export function setGlobalConfigAction(data: any): setGlobalConfigActionInterface {
  localStorage.setItem('globalConfig', JSON.stringify(data));
  return { type: SET_GLOBAL_CONFIG, payload: data };
}
