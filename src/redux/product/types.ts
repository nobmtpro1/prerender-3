export const CHECKOUT_PRODUCT = 'CHECKOUT_PRODUCT';
export interface CheckoutProductAction {
  type: typeof CHECKOUT_PRODUCT;
  payload: any;
}

export const GET_CHECKOUT_PRODUCT = 'GET_CHECKOUT_PRODUCT';
export interface GetCheckoutProductAction {
  type: typeof GET_CHECKOUT_PRODUCT;
}

export const CHECKOUT_PRODUCT_SUCCESS = 'CHECKOUT_PRODUCT_SUCCESS';
export interface CheckoutProductSuccessAction {
  type: typeof CHECKOUT_PRODUCT_SUCCESS;
  payload: any;
}

export const SET_PLACE_ORDER_FORM = 'SET_PLACE_ORDER_FORM';
export interface SetPlaceOrderFormAction {
  type: typeof SET_PLACE_ORDER_FORM;
  payload: any;
}

export const SET_MULTI_CARD_NAME_PLACE_ORDER_FORM = 'SET_MULTI_CARD_NAME_PLACE_ORDER_FORM';
export interface SetMultiCardNamePlaceOrderFormAction {
  type: typeof SET_MULTI_CARD_NAME_PLACE_ORDER_FORM;
  payload: any;
}

export const SET_LINE_ITEMS = 'SET_LINE_ITEMS';
export interface SetLineItemsAction {
  type: typeof SET_LINE_ITEMS;
  payload: any;
}
export const CLEAR_CART = 'CLEAR_CART';
export interface ClearCartAction {
  type: typeof CLEAR_CART;
}

export const DELETE_LINE_ITEMS = 'DELETE_LINE_ITEMS';
export interface DeleteLineItemsAction {
  type: typeof DELETE_LINE_ITEMS;
  payload: any;
}

export const GET_ALL_PRODUCT = 'GET_ALL_PRODUCT';
export interface GetAllProductAction {
  type: typeof GET_ALL_PRODUCT;
  payload: any;
}

export const LOADMORE_PRODUCT = 'LOADMORE_PRODUCT';
export interface LoadMoreProductAction {
  type: typeof LOADMORE_PRODUCT;
  payload: any;
}

export const GET_ALL_PRODUCT_SUCCESS = 'GET_ALL_PRODUCT_SUCCESS';
export interface GetAllProductSuccessAction {
  type: typeof GET_ALL_PRODUCT_SUCCESS;
  payload: any;
}

export const GET_ALL_PRODUCT_FAILURE = 'GET_ALL_PRODUCT_FAILURE';
export interface GetAllProductFailureAction {
  type: typeof GET_ALL_PRODUCT_FAILURE;
  error: Error | string;
}

export const SORT_ALL_PRODUCT = 'SORT_ALL_PRODUCT';
export interface SortAllProductAction {
  type: typeof SORT_ALL_PRODUCT;
  payload: any;
}

export const SORT_ALL_PRODUCT_SUCCESS = 'SORT_ALL_PRODUCT_SUCCESS';
export interface SortAllProductSuccessAction {
  type: typeof SORT_ALL_PRODUCT_SUCCESS;
  payload: any;
}

export const SORT_ALL_PRODUCT_FAILURE = 'SORT_ALL_PRODUCT_FAILURE';
export interface SortAllProductFailureAction {
  type: typeof SORT_ALL_PRODUCT_FAILURE;
  error: Error | string;
}

export const CHECKOUT_PRODUCT_FAILURE = 'CHECKOUT_PRODUCT_FAILURE';
export interface CheckoutProductFailureAction {
  type: typeof CHECKOUT_PRODUCT_FAILURE;
  error: Error | string;
}

export const FILTER_OTHER_PRODUCT = 'FILTER_OTHER_PRODUCT';
export interface FilterOtherProductAction {
  type: typeof FILTER_OTHER_PRODUCT;
  payload: any;
}

export const FILTER_PRICE_PRODUCT = 'FILTER_PRICE_PRODUCT';
export interface FilterPriceProductAction {
  type: typeof FILTER_PRICE_PRODUCT;
  payload: any;
}

export const FILTER_PRODUCT_SUCCESS = 'FILTER_PRODUCT_SUCCESS';
export interface FilterProductSuccessAction {
  type: typeof FILTER_PRODUCT_SUCCESS;
  payload: any;
}

export const FILTER_PRICE_PRODUCT_FAILURE = 'FILTER_PRICE_PRODUCT_FAILURE';
export interface FilterPriceProductFailureAction {
  type: typeof FILTER_PRICE_PRODUCT_FAILURE;
  error: Error | string;
}

export const TOOGLE_FILTER_BOX = 'TOOGLE_FILTER_BOX';
export interface ToogleFilterBoxAction {
  type: typeof TOOGLE_FILTER_BOX;
  payload: any;
}

export interface ICbSuccess {
  (result?: any): void;
}
export interface ICbFailure {
  (error: Error, result?: any): void;
}

export type ProductAction =
  | CheckoutProductAction
  | CheckoutProductSuccessAction
  | CheckoutProductFailureAction
  | SetLineItemsAction
  | GetCheckoutProductAction
  | DeleteLineItemsAction
  | SortAllProductAction
  | SortAllProductSuccessAction
  | SortAllProductFailureAction
  | GetAllProductAction
  | GetAllProductSuccessAction
  | GetAllProductFailureAction
  | FilterPriceProductAction
  | FilterProductSuccessAction
  | FilterPriceProductFailureAction
  | LoadMoreProductAction
  | SetPlaceOrderFormAction
  | SetMultiCardNamePlaceOrderFormAction
  | ToogleFilterBoxAction
  | ClearCartAction;
