import { map } from 'lodash';
import ReactGA from 'react-ga';

export const addProductToCart = (data: any) => {
  window.gtmLayer.push({
    event: 'addToCart',
    ecommerce: {
      currencyCode: 'BDT',
      add: {
        products: [
          {
            name: data?.name,
            id: data?.variant_id,
            price: data?.price,
            brand: data?.brand?.name,
            category: data?.brand?.name,
            variant: data?.variant_title ?? data?.title,
            quantity: data?.quantity,
          },
        ],
      },
    },
  });
};

export const removeProductFromCart = (data: any) => {
  window.gtmLayer.push({
    event: 'removeFromCart',
    ecommerce: {
      remove: {
        products: [
          {
            name: data?.name,
            id: data?.variant_id,
            price: data?.price,
            brand: data?.brand?.name,
            category: data?.brand?.name,
            variant: data?.variant_title ?? data?.title,
            quantity: data?.quantity,
          },
        ],
      },
    },
  });
};

export const ecommerceTransaction = (data: any) => {
  ReactGA.ga('ecommerce:addTransaction', {
    id: data.order_id,
    affiliation: 'Sundora',
    revenue: data?.order?.total_price,
    shipping: '0.00',
    tax: data?.order?.total_tax,
  });

  data?.order?.line_items.forEach((item: any) => {
    ReactGA.ga('ecommerce:addItem', {
      id: data?.order_id,
      name: item?.name,
      sku: item?.sku,
      category: item?.vendor,
      price: item?.price * item?.quantity - item?.total_discount,
      quantity: item?.quantity,
    });
  });

  ReactGA.ga('ecommerce:send');
  ReactGA.ga('ecommerce:clear');
};

export const beginCheckout = (data: any) => {
  const items = map(data.lineItems, (item: any) => {
    return {
      name: item?.name,
      id: item?.variant_id,
      price: item?.price,
      brand: item?.vendor,
      category: item?.vendor,
      variant: item?.variant_title,
      quantity: item?.quantity,
    };
  });

  window.gtmLayer.push({ ecommerce: null });
  window.gtmLayer.push({
    event: 'checkout',
    ecommerce: {
      checkout: {
        actionField: { step: 1, option: 'begin_checkout' },
        products: items,
      },
    },
  });
};

export const purchaseCheckout = (data: any) => {
  const items = map(data.lineItems, (item: any) => {
    return {
      name: item?.name,
      id: item?.variant_id,
      price: item?.price,
      brand: item?.vendor,
      category: item?.vendor,
      variant: item?.variant_title,
      quantity: item?.quantity,
    };
  });
  window.gtmLayer.push({ ecommerce: null });
  window.gtmLayer.push({
    ecommerce: {
      purchase: {
        actionField: {
          id: data?.order_id,
          affiliation: 'Sundora online store',
          revenue: data?.order?.subtotal_price,
          tax: data?.order?.total_tax,
          shipping: data?.order?.total_shipping_price_set?.presentment_money?.amount,
          coupon: data?.order?.applied_discount?.title ?? null,
        },
        products: items,
      },
    },
  });
};
