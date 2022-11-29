import AuthPrimaryIcon from '../../images/icons/auth-primary.png';
import freeShippingPrimaryIcon from '../../images/icons/freeShipping-primary.png';

export const dataIcon = {
  value: {
    icons: [
      {
        text: '100% AUTHENTIC',
        icon_image: {
          original: AuthPrimaryIcon,
          width: 29,
          height: 29,
          webp: AuthPrimaryIcon,
          mobile: AuthPrimaryIcon,
          alt: 'auth_icon.png',
        },
      },
      {
        text: 'FREE SHIPPING*',
        icon_image: {
          original: freeShippingPrimaryIcon,
          width: 52,
          height: 27,
          webp: freeShippingPrimaryIcon,
          mobile: freeShippingPrimaryIcon,
          alt: 'free_shipping_icon.png',
        },
      },
    ],
  },
};

export const iconList = [
  {
    text: 'SECURE PAYMENT',
    icon_image: {
      original: 'https://s.sundora-stage.23c.se/media/images/secure_payment_icon.original.png',
      width: 43,
      height: 28,
      webp:
        'https://s.sundora-stage.23c.se/media/images/secure_payment_icon.original.format-webp.webp',
      mobile:
        'https://s.sundora-stage.23c.se/media/images/secure_payment_icon.width-768.format-webp.webp',
      alt: 'secure_payment_icon.png',
    },
  },
  {
    text: 'FREE SHIPPING*',
    icon_image: {
      original: 'https://s.sundora-stage.23c.se/media/images/free_shipping_icon.original.png',
      width: 52,
      height: 27,
      webp:
        'https://s.sundora-stage.23c.se/media/images/free_shipping_icon.original.format-webp.webp',
      mobile:
        'https://s.sundora-stage.23c.se/media/images/free_shipping_icon.width-768.format-webp.webp',
      alt: 'free_shipping_icon.png',
    },
  },
  {
    text: '100% AUTHENTIC',
    icon_image: {
      original: 'https://s.sundora-stage.23c.se/media/images/auth_icon.original.png',
      width: 29,
      height: 29,
      webp: 'https://s.sundora-stage.23c.se/media/images/auth_icon.original.format-webp.webp',
      mobile:
        'https://s.sundora-stage.23c.se/media/images/auth_icon.width-768.format-webp.webp',
      alt: 'auth_icon.png',
    },
  },
  {
    text: 'OFFICIAL DISTRIBUTOR',
    icon_image: {
      original: 'https://s.sundora-stage.23c.se/media/images/offical_icon.original.png',
      width: 39,
      height: 33,
      webp:
        'https://s.sundora-stage.23c.se/media/images/offical_icon.original.format-webp.webp',
      mobile:
        'https://s.sundora-stage.23c.se/media/images/offical_icon.width-768.format-webp.webp',
      alt: 'offical_icon.png',
    },
  },
  {
    text: 'ON TIME DELIVERY',
    icon_image: {
      original: 'https://s.sundora-stage.23c.se/media/images/time_delivery.original.png',
      width: 36,
      height: 28,
      webp:
        'https://s.sundora-stage.23c.se/media/images/time_delivery.original.format-webp.webp',
      mobile:
        'https://s.sundora-stage.23c.se/media/images/time_delivery.width-768.format-webp.webp',
      alt: 'time_delivery.png',
    },
  },
];

export const sortOptions = [
  {
    value: '-id',
    title: 'Newest',
    type: 'sort',
  },
  {
    value: 'popular',
    title: 'Popular',
    type: 'sort',
  },
  {
    value: 'product_variants__price',
    title: 'Price (low to high)',
    type: 'sort',
  },
  {
    value: '-product_variants__price',
    title: 'Price (high to low)',
    type: 'sort',
  },
];
