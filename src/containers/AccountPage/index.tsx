import { isEmpty, get } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { isMobile } from '../../DetectScreen';
import { fetchCMSHomepage } from '../../redux/Helpers';
import '../../components/BlockBlogs/block-blogs.scss';
import './styles.scss';
import Footer from '../../components/Footer';
import { AccordingSidebar } from '../../components/AccordingSidebar';
import OrderHistory from '../../components/OrderHistory';
import WishList from '../../components/WishList';
import MyAccount from '../../components/MyAccount';
import Review from '../../components/Review';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/auth/actions';
// import SundoraVIP from '../../components/SundoraVIP';
import { Helmet } from 'react-helmet-async';
import { NAV_PAGE_SLUG } from '../../config';
import Newsletter from '../../components/Newsletter';
// import MyReturn from '../../components/MyReturn';
// import RewardPoints from '../../components/RewardPoints';
// import Transactions from '../../components/Transactions';

function AccountPage(props: any) {
  const dispatch = useDispatch();
  const [dataNav, setDataNav] = useState<any>([]);
  const [loading, setLoading] = useState<any>([]);
  const [dataFooter, setDataFooter] = useState<any>([]);
  const [tabName, setTabName] = useState<any>('');

  const fetchDataInit = async () => {
    const slug = props.match.params ? props.match.params : undefined;
    if (isEmpty(dataNav) || slug || isEmpty(dataFooter)) {
      // this.props.loadingPage(true);
      const pending = [fetchCMSHomepage(NAV_PAGE_SLUG)];
      try {
        const results = await Promise.all(pending);
        const cmsData = results[0];
        const dataDynamicLinks = get(cmsData, 'dynamic_links');

        setDataNav(dataDynamicLinks?.navigation);
        setDataFooter(dataDynamicLinks?.footer);
        setLoading(false);
      } catch (error) {
        // this.props.loadingPage(false);
      }
    }
  };

  const renderSwitch = () => {
    switch (tabName) {
      case 'order-history':
        return <OrderHistory />;
      case 'wish-list':
        return <WishList />;
      // case 'sundora-vip':
      //   return <SundoraVIP />;
      case 'my-account':
        return <MyAccount />;
      case 'my-reviews':
        return <Review />;
      case 'newsletter':
        return <Newsletter />;
      // case 'my-return':
      //   return <MyReturn />;
      // case 'reward-points':
      //   return <RewardPoints />;
      // case 'transactions':
      //   return <Transactions />;
      case 'logout':
        dispatch(actions.logoutActions());
        return;
      default:
        return '';
    }
  };

  useEffect(() => {
    fetchDataInit();
  }, []);

  useEffect(() => {
    setTabName(props.match.params.tabName);
  }, [props.match.params.tabName]);

  return (
    <div className="site-AccountPage">
      <Helmet>
        <meta property="og:title" content="Account page | Sundora" />
        <meta property="og:description" content="Account page | Sundora" />
        <title>Account page | Sundora</title>
        <meta name="description" content="Account page | Sundora" />
      </Helmet>
      {loading ? <Loader /> : ''}
      {/* <Banner /> */}
      <main>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-12 col-12">
              <AccordingSidebar
                // you can use your own router's api to get pathname
                activeItemId={props?.match?.url ? props?.match?.url : '/account/my-account'}
                onSelect={({ itemId }) => {
                  // maybe push to the route
                  props.history.push(itemId);
                }}
                items={[
                  // {
                  //   title: 'Sundora vip',
                  //   itemId: '/account/sundora-vip',
                  //   iconName: 'sundora-vip',
                  // },
                  {
                    title: 'My account',
                    itemId: '/account/my-account',
                    iconName: 'account',
                  },
                  // {
                  //   title: 'Address book',
                  //   itemId: '/account/address-book',
                  //   iconName: 'location',
                  // },
                  {
                    title: 'Wish list',
                    itemId: '/account/wish-list',
                    iconName: 'heart',
                  },
                  {
                    title: 'Newsletter',
                    itemId: '/account/newsletter',
                    iconName: 'tag',
                  },
                  {
                    title: 'Order history',
                    itemId: '/account/order-history',
                    iconName: 'order',
                  },
                  // {
                  //   title: 'My return',
                  //   itemId: '/account/my-return',
                  //   iconName: '',
                  // },
                  // {
                  //   title: 'Reward points',
                  //   itemId: '/account/reward-points',
                  //   iconName: '',
                  // },
                  {
                    title: 'My reviews',
                    itemId: '/account/my-reviews',
                    iconName: '',
                  },
                  // {
                  //   title: 'Transactions',
                  //   itemId: '/account/transactions',
                  //   iconName: '',
                  // },
                  {
                    title: 'Logout',
                    itemId: '/account/logout',
                    iconName: '',
                  },
                ]}
              />
            </div>
            <div
              className="col-lg-9 col-md-12 col-12"
              style={{ padding: !isMobile ? '0 2em' : '0 1em' }}
            >
              {renderSwitch()}
            </div>
          </div>
        </div>
      </main>
      <Footer data={dataFooter} />
    </div>
  );
}

export default memo(AccountPage);
