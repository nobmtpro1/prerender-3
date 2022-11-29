import * as actions from './types';

export function checkoutProduct(payload: any): actions.CheckoutProductAction {
  return { type: actions.CHECKOUT_PRODUCT, payload };
}

export function getCheckoutProduct(): actions.GetCheckoutProductAction {
  return { type: actions.GET_CHECKOUT_PRODUCT };
}

export function setLineItems(payload: any): actions.SetLineItemsAction {
  return { type: actions.SET_LINE_ITEMS, payload };
}

export function clearCart(): actions.ClearCartAction {
  return { type: actions.CLEAR_CART };
}

export function deleteLineItems(payload: any): actions.DeleteLineItemsAction {
  return { type: actions.DELETE_LINE_ITEMS, payload };
}

export function checkoutProductSuccess(payload: any): actions.CheckoutProductSuccessAction {
  return {
    type: actions.CHECKOUT_PRODUCT_SUCCESS,
    payload,
  };
}

export function getAllProduct(payload: any): actions.GetAllProductAction {
  return { type: actions.GET_ALL_PRODUCT, payload };
}

export function loadMoreProduct(payload: any): actions.LoadMoreProductAction {
  return { type: actions.LOADMORE_PRODUCT, payload };
}

export function sortAllProduct(payload: any): actions.SortAllProductAction {
  return { type: actions.SORT_ALL_PRODUCT, payload };
}

export function sortAllProductSuccess(payload: any): actions.SortAllProductSuccessAction {
  return {
    type: actions.SORT_ALL_PRODUCT_SUCCESS,
    payload,
  };
}

export function sortAllProductFailure(
  error: Error | string,
): actions.SortAllProductFailureAction {
  return {
    type: actions.SORT_ALL_PRODUCT_FAILURE,
    error,
  };
}

export function checkoutProductFailure(
  error: Error | string,
): actions.CheckoutProductFailureAction {
  return {
    type: actions.CHECKOUT_PRODUCT_FAILURE,
    error,
  };
}

export function filterPriceProduct(payload: any): actions.FilterPriceProductAction {
  return { type: actions.FILTER_PRICE_PRODUCT, payload };
}

export function filterProductSuccess(payload: any): actions.FilterProductSuccessAction {
  return {
    type: actions.FILTER_PRODUCT_SUCCESS,
    payload,
  };
}

export function filterPriceProductFailure(
  error: Error | string,
): actions.FilterPriceProductFailureAction {
  return {
    type: actions.FILTER_PRICE_PRODUCT_FAILURE,
    error,
  };
}

export function setPlaceOrderForm(payload: any): actions.SetPlaceOrderFormAction {
  return {
    type: actions.SET_PLACE_ORDER_FORM,
    payload,
  };
}

export function setMultiCardNamePlaceOrderForm(
  payload: any,
): actions.SetMultiCardNamePlaceOrderFormAction {
  return {
    type: actions.SET_MULTI_CARD_NAME_PLACE_ORDER_FORM,
    payload,
  };
}

export function toogleFilterBox(payload: any): actions.ToogleFilterBoxAction {
  return {
    type: actions.TOOGLE_FILTER_BOX,
    payload,
  };
}
