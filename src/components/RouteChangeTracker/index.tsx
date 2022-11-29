import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';

const RouteChangeTracker = ({ history }: any) => {
  history.listen((location: any) => {
    // console.log(location);
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  });

  return <></>;
};

export default withRouter(RouteChangeTracker);
