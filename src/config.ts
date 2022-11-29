// Window.env is templated into the docker container index.html at run time.
// See contrib/nginx/99-envsubst-react-app.sh and public/index.html for how config values can be inserted.
// During development process.env will be used directly because rebuilding is not a problem there.
declare global {
  interface Window {
    env: {
      REACT_APP_API_URL: string;
    };
    gtmLayer: any;
    // gtag: (...args: any[]) => void;
  }
}

// API_URL is the sundora server root URL.
/* eslint-disable */
export const API_URL: string =
  window.env.REACT_APP_API_URL !== '${REACT_APP_API_URL}' &&
  window.env.REACT_APP_API_URL !== ''
    ? window.env.REACT_APP_API_URL
    : process.env.REACT_APP_API_URL || '';
/* eslint-disable */
export const PHONE_CONTACT = '+880 1966 444455';

export const MAXIMUM_QUANTITY_ADDING_TO_CART = 6;

export const SHOPIFY_DOMAIN = 'sundora-bd.myshopify.com';
export const GOOGLE_MAP_API = 'AIzaSyCnhoR2-DBpVvP1aLl3CJ-8O0aueJ_jlCQ';
export const FACEBOOK_PAGE_CHAT_ID = '119702535333289';

export const NAV_PAGE_SLUG = `nav/`;

// API
export const LOGIN = `${API_URL}/api/user/api-auth/`;
export const LOGIN_WITH_FACEBOOK = `${API_URL}/api/user/auth/facebook/`;
export const LOGIN_WITH_INSTAGRAM = `${API_URL}/api/user/auth/instagram/`;
export const LOGIN_WITH_GOOGLE = `${API_URL}/api/user/auth/google/`;
export const GET_SOCIAL_MEDIA_CLIENT_IDS = `${API_URL}/api/user/auth/social-media/client-ids/`;
export const LOGOUT = `${API_URL}/api/user/customer/logout/`;
export const REGISTER = `${API_URL}/api/user/customer/`;
export const GET_PAGE_CMS_HOME_PAGE_URL = `${API_URL}/api/pages/`;
export const GET_PAGE_CMS_PAGE_URL = `${API_URL}/api/html/`;
export const GET_PAGE_ALL_BLOG_LIST = `${API_URL}/api/blog/`;
export const GET_PAGE_ALL_BLOG_LIST_FILTER_TAG = `${API_URL}/api/blog/tags/`;
export const CHECKOUT_ENDPOINT = `${API_URL}/api/checkout/checkouts/`;
export const GET_PRODUCT_DETAIL = `${API_URL}/api/shopify/products/`;
export const GET_PRODUCT_FILTER = `${API_URL}/api/collection/collections-brand/`;
export const GET_ALL_PRODUCT = `${API_URL}/api/shopify/products/`;
export const GET_FILTER_BOX_PRODUCT = `${API_URL}/api/shopify/products/filter-list/`;
export const POST_CHECK_VALID_EMAIL = `${API_URL}/api/user/customer/check_email/`;
export const PUT_DISCOUNT_CODE = `${API_URL}/api/checkout/checkouts/`;
export const GET_LOCATION = `${API_URL}/api/location/locations/`;
export const GET_ADDRESS = `${API_URL}/api/user/address/user/`;
export const POST_ADDRESS = `${API_URL}/api/user/address/`;
export const GET_WISHLIST = `${API_URL}/api/wishlist/user`;
export const GET_REVIEWS = `${API_URL}/api/review/reviews/`;
export const GET_USER_INFO = `${API_URL}/api/user/customer/info/`;
export const PUT_PLACE_ORDER_CHECKOUT = `${API_URL}/api/payment/payments/`;
export const GET_ORDER_HISTORY = `${API_URL}/api/checkout/orders/`;
export const PUT_USER_INFO = `${API_URL}/api/user/customer/update_info/`;
export const POST_RESET_PASSWORD = `${API_URL}/api/user/reset-password/send-mail/`;
export const POST_VERIFY_RESET_PASSWORD = `${API_URL}/api/user/reset-password/`;
export const GET_QUESTIONNAIRE = `${API_URL}/api/questionnaire/`;
export const GET_SUNDORA_VIP = `${API_URL}/api/loyalty/tiers/`;
export const GET_VOUCHER = `${API_URL}/api/loyalty/vouchers/`;
export const POST_EARN_POINT_SHARE_SOCIAL = `${API_URL}/api/loyalty/earn-point/share-social/`;
export const GET_TIER_HISTORY = `${API_URL}/api/loyalty/tier-history/`;
export const POST_NEWSLETTER_EMAIL = `${API_URL}/api/user/newsletter_customer/`;
export const GET_VERIFY_CUSTOMER_EMAIL = `${API_URL}/api/user/customer/verify-email/`;
export const POST_VERIFICATION_LINK = `${API_URL}/api/user/customer/send_verification_link/`;
export const PUT_NEWSLETTER_CONFIG = `${API_URL}/api/user/customer/update_newsletter/`;
export const VERIFY_SMS = `${API_URL}/api/user/customer/verify_sms/`;
export const POST_SEND_VERIFY_SMS_CODE = `${API_URL}/api/user/customer/send_verify_sms_code/`;
export const GET_AFFILIATE_CODE_CHECK_EXIST = `${API_URL}/api/checkout/affiliate-code/check-exist`;

export const PERFUME_TYPE_TAGS = ['edc', 'edp', 'edt'];
export const PERFUME_TYPE_MAP: { [key: string]: string } = {
  edc: 'Eau de Cologne',
  edp: 'Eau de Parfum',
  edt: 'Eau de Toilette',
};

export const PHONE_REGEX = /^(?:\+88|88)?(01[3-9]\d{8})$/;
export const PHONE_PREFIX_REGEX = /^\+88|88/;
export const ID_SCHEMA_PRODUCT_DETAIL = 'schema-product-detail';
export const SEO_TITLE = 'Sundora - Your True Experience - In Bangladesh';
export const SEO_DESCRIPTION =
  'Discover premium online and offline retail experience with a selection of the world best perfumes, candles, skincare and makeup in Bangladesh including Free Shipping* | Best Price | 10 days Return | Free Samples';
