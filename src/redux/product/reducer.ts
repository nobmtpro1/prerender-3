import * as actions from './types';

export interface ProductState {
  product: any;
  lineItems: any;
  loading: boolean;
  productStore: any;
  allProduct: any;
  sortValue: any;
  filterOption: any;
  placeOrderForm: any;
  isOpenFilterBox: any;
}

const initialState: ProductState = {
  product: null,
  lineItems: [],
  loading: false,
  isOpenFilterBox: false,
  allProduct: null,
  productStore: [],
  sortValue: [],
  filterOption: [
    // {
    //   type: 'minMax',
    //   value: '1 - 20000',
    //   sortData: {
    //     minPrice: '',
    //     maxPrice: '',
    //   },
    // },
    // {
    //   type: 'other',
    //   sortData: [{ id: '' }],
    // },
    // {
    //   type: 'scent',
    //   sortData: [{ id: '' }],
    // },
  ],
  placeOrderForm: {
    address_id: null,
    address_billing_id: null,
    store_location_id: null,
    multi_card_name: null,
    cash_on_pickup: false,
  },
};

export default function productReducer(
  state: ProductState = initialState,
  action: actions.ProductAction,
): ProductState {
  switch (action.type) {
    case actions.CHECKOUT_PRODUCT:
      return {
        ...state,
        loading: true,
      };
    case actions.CHECKOUT_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
        placeOrderForm: {
          ...state.placeOrderForm,
          address_id: state.lineItems?.length ? state.placeOrderForm?.address_id : null,
          address_billing_id: state.lineItems?.length
            ? state.placeOrderForm?.address_billing_id
            : null,
        },
        // lineItems: [...action.payload.line_items] || [],
      };
    case actions.SET_LINE_ITEMS:
      return {
        ...state,
        lineItems: [...action.payload],
        loading: true,
      };
    case actions.CLEAR_CART:
      return {
        ...state,
        product: null,
        lineItems: [],
        loading: false,
      };
    case actions.DELETE_LINE_ITEMS:
      return {
        ...state,
        lineItems: action.payload,
        loading: true,
      };
    case actions.CHECKOUT_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case actions.GET_ALL_PRODUCT:
      return {
        ...state,
        loading: false,
        allProduct: action.payload,
        productStore: action.payload,
      };
    case actions.LOADMORE_PRODUCT:
      return {
        ...state,
        loading: false,
        allProduct: [...state.allProduct, ...action.payload],
        productStore: [...state.allProduct, ...action.payload],
      };

    case actions.SORT_ALL_PRODUCT:
      return {
        ...state,
        loading: true,
        sortValue: action.payload,
      };
    case actions.SORT_ALL_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        allProduct: action.payload,
      };
    case actions.SORT_ALL_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case actions.FILTER_PRICE_PRODUCT:
      return {
        ...state,
        loading: false,
      };
    case actions.FILTER_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        allProduct: action.payload,
      };
    case actions.SET_PLACE_ORDER_FORM:
      return {
        ...state,
        placeOrderForm: { ...state.placeOrderForm, ...action.payload },
      };
    case actions.SET_MULTI_CARD_NAME_PLACE_ORDER_FORM:
      return {
        ...state,
        placeOrderForm: {
          ...state.placeOrderForm,
          ...action.payload,
        },
      };
    case actions.TOOGLE_FILTER_BOX:
      return {
        ...state,
        isOpenFilterBox: action.payload,
      };
    default:
      return state;
  }
}
