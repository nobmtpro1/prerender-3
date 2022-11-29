import axios from 'axios';
import _, { sumBy } from 'lodash';
import toastr from 'toastr';

import {
  API_URL,
  CHECKOUT_ENDPOINT,
  GET_PAGE_CMS_HOME_PAGE_URL,
  GET_PAGE_CMS_PAGE_URL,
  GET_USER_INFO,
  GET_WISHLIST,
  ID_SCHEMA_PRODUCT_DETAIL,
} from '../../config';

export const moneyFormater = (money: any) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'BDT',
    useGrouping: true,
    minimumFractionDigits: 0,
    currencyDisplay: 'symbol',
  });
  // const moneyFormat = parseInt(money);
  return formatter.format(money).replace(/\s/g, '').replace('BDT', '৳');
};

export const getDiscountedPrice = (money: string, rebate: number, formatted = true) => {
  let value = money;
  if (!value || !value.length || isNaN(parseFloat(value))) {
    value = '0';
  }
  const valueWithDiscount: number = Math.ceil((1 - rebate / 100) * parseFloat(value));
  if (formatted) return moneyFormater(valueWithDiscount);
  return valueWithDiscount.toString();
};

export const getAppliedDiscountedPrice = (money: string, amount: string, formatted = true) => {
  let value = money;
  let discount = amount;
  if (!value || !value.length || isNaN(parseFloat(value))) value = '0';
  if (!discount || !discount.length || isNaN(parseFloat(discount))) discount = '0';

  const valueWithDiscount: number = parseFloat(value) - parseFloat(discount);
  if (formatted) return moneyFormater(valueWithDiscount);
  return valueWithDiscount.toString();
};

export const toastrInfo = (title: any, message: any) => {
  toastr.info(title, message, {
    progressBar: false,
    positionClass: 'toast-bottom-left',
  });
};

export const toastrSuccess = (title: any) => {
  toastr.success(title, 'Success', {
    progressBar: false,
    positionClass: 'toast-top-right',
    timeOut: 1000,
  });
};

export const toastrError = (title: any) => {
  toastr.error(title, 'Error', {
    progressBar: false,
    positionClass: 'toast-top-right',
  });
};

export const toastrWarning = (title: any) => {
  toastr.warning(title, 'Warning', {
    progressBar: false,
    positionClass: 'toast-top-right',
  });
};

export async function fetchRequestAxios(myRequest: any, toaster = true, guest = false) {
  try {
    const response = await axios(myRequest);
    if (response.status === 200 || response.status === 201) {
      const body = await response.data;
      return body;
    }
    const body = await response.data;
    return {
      isError: true,
      message: '',
      email: body ? body.email : '',
    };
  } catch (error) {
    if (error?.response?.status == 404) {
      window.location.replace('/404');
    }
    if (error.message === 'Network Error') {
      // alert('You seem to be offline, please check your connection');
      return null;
    }
    const { data } = error.response;
    if (error?.response?.status == 401 && toaster && !guest) {
      toastr.error('Please login to proceed', 'Error', { preventDuplicates: true });
      return {
        isError: true,
        status: 401,
        message: data.message,
      };
    }
    if (error.response.status === 400) {
      if (Array.isArray(error.response.data.errors) && toaster) {
        Object.keys(error.response.data.errors).map(function (key) {
          toastrWarning(`${key} ${error.response.data.errors[key]}`.toUpperCase());
        });
        return {
          isError: true,
          status: 400,
          message: data.errors,
        };
      } else if (typeof error?.response?.data?.errors === 'string' && toaster) {
        toastrWarning(error?.response?.data?.errors);
        return {
          isError: true,
          status: 400,
          message: data.errors,
        };
      }
      return {
        isError: true,
        status: 400,
        message: data.errors,
      };
    }

    if (data.status === 204) {
      return {
        isError: false,
      };
    }
    if (data.status === 404) {
      return {
        isError: true,
        status: 404,
        message: data.message,
      };
    }
    if (data.status === 422) {
      return {
        isError: true,
        status: 404,
        message: data.message,
      };
    }

    return { isError: true, message: data.message };
  }
}

export const fetchCMSHomepage = async (id: any) => {
  try {
    // const options = {
    //   method: 'GET',
    //   url: `${GET_PAGE_CMS_HOME_PAGE_URL}${id}`,
    // };
    // return fetchRequestAxios(options);
    const res = await axios.get(
      `${GET_PAGE_CMS_HOME_PAGE_URL}${id}?timestamp=${new Date().getTime()}`,
      {
        headers: {
          Authorization: localStorage.getItem('sundoraToken')
            ? `Token ${localStorage.getItem('sundoraToken')}`
            : '',
        },
      },
    );
    return res?.data;
  } catch (error) {
    return null;
  }
};

export const fetchDynamicCMSPage = (id: any) => {
  try {
    const options = {
      method: 'GET',
      url: `${GET_PAGE_CMS_PAGE_URL}${id}`,
    };
    return fetchRequestAxios(options);
  } catch (error) {
    return null;
  }
};

export const fetchClient = ({
  url,
  method,
  body = null,
  toaster = true,
  guest = false,
}: {
  url: any;
  method: any;
  body: any;
  toaster?: boolean;
  guest?: boolean;
}) => {
  const AUTH_TOKEN = `Token ${localStorage.getItem('sundoraToken')}`;
  let defaultHeaders = {
    'Content-Type': 'application/json',
  };
  if (localStorage.getItem('sundoraToken')) {
    defaultHeaders = { ...defaultHeaders, ...{ authorization: AUTH_TOKEN } };
  }

  const options = {
    method,
    url,
    headers: defaultHeaders,
    data: body,
  };
  return fetchRequestAxios(options, toaster, guest);
};

export const updateProductToBag = (lineItems: any) => {
  const idCheckout =
    localStorage.getItem('id_checkout') && localStorage.getItem('id_checkout') != 'null'
      ? localStorage.getItem('id_checkout')
      : null;
  if (lineItems.length == 0 && idCheckout) {
    try {
      const options = {
        url: idCheckout ? `${CHECKOUT_ENDPOINT}${idCheckout}` : `${CHECKOUT_ENDPOINT}`,
        method: 'DELETE',
        body: null,
      };
      return fetchClient(options);
    } catch (error) {
      return null;
    }
  } else {
    try {
      const options = {
        method: idCheckout ? 'PUT' : 'POST',
        url: idCheckout ? `${CHECKOUT_ENDPOINT}${idCheckout}/` : `${CHECKOUT_ENDPOINT}`,
        body: {
          draft_order: {
            line_items: lineItems,
          },
        },
      };
      return fetchClient(options);
    } catch (error) {
      return null;
    }
  }
};

export const getProductToBag = () => {
  const idCheckout =
    localStorage.getItem('id_checkout') && localStorage.getItem('id_checkout') != 'null'
      ? localStorage.getItem('id_checkout')
      : null;
  const guest_id = localStorage.getItem('sundora_guest_id');
  // if (!lineItems) return;
  // if (!idCheckout) return;
  let url = CHECKOUT_ENDPOINT;
  if (idCheckout) {
    url = `${CHECKOUT_ENDPOINT}?draft_order_id=${idCheckout}`;
  }
  if (guest_id) {
    url = `${CHECKOUT_ENDPOINT}?user_id=${guest_id}`;
  }
  try {
    const options = {
      url: url,
      method: 'GET',
      body: null,
    };
    return fetchClient(options);
  } catch (error) {
    return null;
  }
};

export const checkValidToken = async () => {
  let defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (localStorage.getItem('sundoraToken')) {
    const AUTH_TOKEN = `Token ${localStorage.getItem('sundoraToken')}`;
    defaultHeaders = { ...defaultHeaders, ...{ authorization: AUTH_TOKEN } };
    try {
      const response = await axios({
        method: 'GET',
        url: GET_USER_INFO,
        headers: defaultHeaders,
      });
      if (response.status === 200 || response.status === 201) {
        const body = await response.data;
        localStorage.setItem('sundoraToken', body?.data?.token);
        localStorage.setItem('id_checkout', body?.data?.draft_order_id);
        return body;
      }
    } catch (error) {
      if (error.message === 'Network Error') {
        toastrError('You seem to be offline, please check your connection');
        return null;
      }
      if (error.response.status == 401) {
        localStorage.removeItem('sundoraToken');
        localStorage.removeItem('id_checkout');
      }
    }
  }
};

export const checkWishlist = () => {
  const token = localStorage.getItem('sundoraToken');
  const productId = localStorage.getItem('product_wishlist_id');
  if (token && productId) {
    const options = {
      url: `${GET_WISHLIST}/`,
      method: 'POST',
      body: {
        product_id: productId,
      },
    };
    fetchClient(options).then((res: any) => {
      if (res.success) {
        toastrSuccess(res?.message);
      }
    });
  }
  localStorage.removeItem('product_wishlist_id');
};

export const validateEmail = (email: any) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const validatePhone = (phoneNumber: any) => {
  // Regular Expression to match Bangladeshi Phone number
  // const re = /^(?:\+88|88)?(01[3-9]\d{8})$/;
  // const re = /^[+]?(8801){1}\d{8,10}$/;
  // const re = /((01){1}[3456789]{1}(\d){8})$/;
  const re = /(^(\+880|880|0)?(1){1}[013456789]{1}(\d){8})$/;

  return re.test(phoneNumber);
};

export const ucfirst = (str: any) => {
  const firstLetter = str.slice(0, 1);
  return str && str.length > 0 ? firstLetter.toUpperCase() + str.substr(1).toLowerCase() : '';
};

export const formatPhoneNumber = (str: any) => {
  return `+88${str}`;
};

export const slugToTitle = (slug: any) => {
  const words = slug.split('_');
  return words.join(' ').charAt(0).toUpperCase() + words.join(' ').slice(1);
};

export const parseUrlAPI = (url: string) => {
  try {
    const path = new URL(url)?.pathname;
    return new URL(path, API_URL)?.href;
  } catch {
    return '';
  }
};

export const addScriptForProduct = (data: any) => {
  removeScriptProductDetail();

  const sum = sumBy(data?.reviews, (item: any) => item.star);
  const avg = Number(
    data?.reviews && sum ? (Math.round((sum / data?.reviews.length) * 2) / 2).toFixed(1) : 0,
  );
  const url = window.location.href;
  const reviews = _.map(
    data?.reviews,
    (item: any) => `
      <div itemprop="review" itemtype="https://schema.org/Review" itemscope>
        <div itemprop="author" itemtype="https://schema.org/Person" itemscope>
          <meta itemprop="name" content="${item?.name}" />
        </div>
        <div itemprop="reviewRating" itemtype="https://schema.org/Rating" itemscope>
          <meta itemprop="ratingValue" content="${item?.star}" />
          <meta itemprop="bestRating" content="5" />
        </div>
      </div>`,
  );

  const dataReviews =
    reviews.length > 0
      ? reviews.toString().replaceAll('/>,<', '/><') +
        `<div itemprop="aggregateRating" itemtype="https://schema.org/AggregateRating" itemscope>
          <meta itemprop="reviewCount" content="${data?.reviews?.length}" />
          <meta itemprop="ratingValue" content="${avg}" />
        </div>`
      : '';

  const imageLinks = _.map(
    data?.images,
    (x) => `<link itemprop="image" href=${x?.url?.original} />`,
  );

  const SEOData = getSeoDataFromMetaFields(data?.metafields);
  const ele = document.createElement('div');
  const convertString = data?.body_html.replace(/<[^>]+>/g, '');

  ele.id = ID_SCHEMA_PRODUCT_DETAIL;
  ele.innerHTML = `
      <div itemtype="https://schema.org/Product" itemscope>
        <meta itemprop="name" content="${SEOData.SEOTitle || data?.name}" />
        <meta itemprop="sku" content="${data?.product_variants[0]?.sku}" />
        <meta itemprop="description" content="${SEOData.SEODes || convertString}" />
        ${imageLinks.toString().replaceAll('/>,<', '/><')}
        <div itemprop="brand" itemtype="https://schema.org/Brand" itemscope>
          <meta itemprop="name" content="${data?.brand?.name}" />
        </div>
        <div itemprop="offers" itemtype="https://schema.org/Offer" itemscope>
          <link itemprop="url" href="${url}" />
          <meta itemprop="availability" content="https://schema.org/InStock" />
          <meta itemprop="priceCurrency" content="BDT" />
          <meta itemprop="itemCondition" content="https://schema.org/NewCondition" />
          <meta itemprop="price" content="${data?.product_variants[0]?.price}" />
        </div>
        ${dataReviews}
      </div>
    `;

  document.body.appendChild(ele);
};

export const removeScriptProductDetail = () => {
  removeScript(ID_SCHEMA_PRODUCT_DETAIL);
};

const removeScript = (id: string) => {
  const ele = document.getElementById(id);
  if (ele) {
    ele?.parentNode?.removeChild(ele);
  }
};

export const getSeoDataFromMetaFields = (metaFields: any) => {
  const SEOTitleKey = 'title_tag';
  const SEODesKey = 'description_tag';

  const SEOTitle = _.find(metaFields, (x) => x?.key === SEOTitleKey)?.value;
  const SEODes = _.find(metaFields, (x) => x?.key === SEODesKey)?.value;
  return { SEOTitle, SEODes };
};
