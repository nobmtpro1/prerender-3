import { lazy } from 'react';
import IRoute from '../interfaces/route';

const routes: IRoute[] = [
  {
    path: '/',
    name: 'Home Page',
    component: lazy(() => import('../containers/HomePage')),
    exact: true,
  },
  {
    path: '/blog',
    name: 'Blogs Page',
    component: lazy(() => import('../containers/BlogListPage')),
    exact: true,
  },
  {
    path: '/blogs/tags/:tag',
    name: 'Blogs Page',
    component: lazy(() => import('../containers/BlogTagsListPage')),
    exact: true,
  },
  {
    path: '/blog',
    name: 'Article Page',
    component: lazy(() => import('../containers/ArticlePage')),
    exact: false,
  },
  {
    path: '/all-product/',
    name: 'Product Page',
    component: lazy(() => import('../containers/BrandProductPage')),
    exact: true,
  },
  {
    path: '/brand/:IDBrand/:IDProduct',
    name: 'Product Detail Page',
    component: lazy(() => import('../containers/ProductPage')),
    exact: true,
  },
  // {
  //   path: '/brand/:IDBrand',
  //   name: 'Product Page',
  //   component: lazy(() => import('../containers/AllProduct')),
  //   exact: true,
  // },
  {
    path: '/checkout',
    name: 'Checkout Page',
    component: lazy(() => import('../containers/CheckoutPage')),
    exact: false,
  },
  {
    path: '/page/:idDefaultPage',
    name: 'Page',
    component: lazy(() => import('../containers/PageDefault')),
    exact: false,
  },
  {
    path: '/product/',
    name: 'Search result Page',
    component: lazy(() => import('../containers/SearchResultPage')),
    exact: false,
  },
  {
    path: '/forgot-password/',
    name: 'Forgot password Page',
    component: lazy(() => import('../containers/ForgotPasswordPage')),
    exact: true,
  },
  {
    path: '/forgot-password/:id',
    name: 'Forgot password Page',
    component: lazy(() => import('../containers/VerifyForgotPasswordPage')),
    exact: true,
  },
  {
    path: '/verify-email/:id',
    name: 'Verify customer email Page',
    component: lazy(() => import('../containers/VerifyCustomerEmailPage')),
    exact: true,
  },
  {
    path: '/404',
    name: 'Not found Page',
    component: lazy(() => import('../components/Notfound')),
    exact: true,
  },
  {
    path: '/receipt/:id',
    name: 'Receipt page',
    component: lazy(() => import('../containers/ReceiptPage')),
    exact: true,
  },
  // {
  //   path: '/',
  //   name: 'render Page',
  //   component: lazy(() => import('../containers/RenderPage')),
  //   exact: false,
  // },
];

export default routes;
