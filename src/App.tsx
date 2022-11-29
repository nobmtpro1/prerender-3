import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';
import './App.scss';
import Loader from './components/Loader';
import { API_URL } from './config';
import routes from './routes/routeModel';
import { checkValidToken, checkWishlist } from './redux/Helpers';
import ScrollToTop from './redux/Helpers/ScrollToTop';
import { Redirect, RouteProps } from 'react-router';
import RouteChangeTracker from './components/RouteChangeTracker';
import ReactGA from 'react-ga';
import BlockFBMessenger from './components/BlockFBMessenger';
import Header from './components/Header';
import { useDispatch } from 'react-redux';
import { loginSuccessActions } from './redux/auth/actions';
import useGlobalConfig from './utils/customHooks/useGlobalConfig';

const PaymentVerifyPage = lazy(() => import('./containers/PaymentVerifyPage'));
const OrderCODVerifyPage = lazy(() => import('./containers/OrderCODVerifyPage'));
const AccountPage = lazy(() => import('./containers/AccountPage'));
const RenderPage = lazy(() => import('./containers/RenderPage'));
const Notfound = lazy(() => import('./components/Notfound'));
// const Header = lazy(() => import('./components/Header'));
const BlockText = lazy(() => import('./components/BlockText'));

console.log('API URL', API_URL); // use this as api base url, this line should probably be erased later.

ReactGA.initialize('UA-89663334-1', {
  debug: false,
});

// ReactGA.ga('require', 'ecommerce');

export interface IPrivateRouteProps extends RouteProps {
  isAuth: boolean; // is authenticate route
  redirectPath: string; // redirect path if don't authenticate route
}

export const PrivateRoute: React.FC<IPrivateRouteProps> = (props) => {
  return props.isAuth ? (
    <Route {...props} component={props.component} render={undefined} />
  ) : (
    <Redirect to={{ pathname: props.redirectPath }} />
  );
};

// eslint-disable-next-line @typescript-eslint/ban-types
const App: React.FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  useGlobalConfig();

  useEffect(() => {
    const setUser = async () => {
      const user = await checkValidToken();
      dispatch(loginSuccessActions(user?.data));
    };
    checkWishlist();
    setUser();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Header />
          <BlockText />
          {/* </Suspense> */}
          {/* <Suspense fallback={<Loader />}> */}
          <ScrollToTop>
            <Switch>
              {routes.map((route, index) => {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    render={(props: RouteComponentProps<any>) => (
                      <route.component {...props} {...route.props} name={route.name} />
                    )}
                  />
                );
              })}
              <PrivateRoute
                isAuth={localStorage.getItem('sundoraToken') ? true : false}
                redirectPath="/404"
                path="/account/:tabName"
                component={AccountPage}
              />
              <PrivateRoute
                isAuth={localStorage.getItem('sundoraToken') ? true : false}
                redirectPath="/404"
                path="/verify/:status/:id"
                component={PaymentVerifyPage}
              />
              <Route path="/order-verify/:status/:id" component={OrderCODVerifyPage} />
              {/* <PrivateRoute
                isAuth={localStorage.getItem('sundoraToken') ? true : false}
                redirectPath="/404"
                path="/order-verify/:status/:id"
                component={OrderCODVerifyPage}
              /> */}
              <Route path="/" exact={false} component={RenderPage} />
              <Route component={Notfound} />
            </Switch>
          </ScrollToTop>
          {/* </Suspense> */}
          {/* <Suspense fallback={''}> */}
          <RouteChangeTracker />
          <BlockFBMessenger />
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;
