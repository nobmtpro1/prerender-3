import React, { useEffect, useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import Banner from '../../components/Banner/index';
import SubNavigation from '../SubNavigation';
import ProductBag from '../ProductBag';
import BagIcon from '../BagIcon';
import UserIcon from '../../images/icons/user-profile.png';
import SearchBox from '../Banner/SearchBox';
import LoginModal from '../LoginModal';
import { useHistory } from 'react-router-dom';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import * as action from '../../redux/auth/actions';

function Navigation({ data = [] }: { data: any }) {
  const ref = useRef<any>(null);
  const dispatch = useDispatch();
  const [isSticky, setSticky] = useState<boolean>(false);
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<{ index: number | null; active: boolean }>({
    index: null,
    active: false,
  });

  const userReducer = useSelector((state: RootStateOrAny) => state?.userReducer);

  useEffect(() => {
    window.addEventListener('scroll', _handleScroll);
    return () => window.removeEventListener('scroll', _handleScroll);
  }, []);

  const _handleScroll = () => {
    if (ref && ref.current) {
      const offset = window.scrollY;
      const height = ref.current.clientHeight;
      if (offset > height) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    }
  };

  const handelActiveSubNav = (index: any) => {
    setIsOpen({
      index: index,
      active: true,
    });
  };

  const handelCloseSubNav = () => {
    if (isOpen.active) {
      setIsOpen({
        index: null,
        active: false,
      });
    }
  };

  const handelCloseOpenedNav = () => {
    setIsOpen((prev) => ({
      index: prev.index,
      active: false,
    }));
  };

  const handleClickUserIc = () => {
    const AUTH_TOKEN = localStorage.getItem('sundoraToken');
    AUTH_TOKEN
      ? history.push('/account/my-account')
      : dispatch(action.toggleModalLoginActions(true));
  };

  console.log(data);

  return data ? (
    <header>
      <section className={`div-headerHome ${isSticky ? 'sticky' : ''}`}>
        <div className="menu-header">
          <Banner />
          <div
            className={`navigation-block`}
            ref={ref}
            onMouseLeave={() => handelCloseOpenedNav()}
          >
            <ul className="navigation-content">
              {data.map((item: any, index: any) => {
                if (item?.visible_only_to_logged_in_users) {
                  if (!userReducer?.user) {
                    return;
                  }
                }

                return (
                  <li
                    key={index}
                    className={`navigation-content__item ${
                      isOpen.index === index && isOpen.active == true ? 'active' : ''
                    }`}
                  >
                    {item?.redirect_url && item?.redirect_url?.relative_url ? (
                      <a
                        href={item.redirect_url.relative_url}
                        className="title-item"
                        onMouseOver={(e) => {
                          e.stopPropagation();
                          item.children.length > 0 || item.products.headline
                            ? handelActiveSubNav(index)
                            : '';
                        }}
                      >
                        {item.title}
                      </a>
                    ) : item.children.length > 0 || item.products.headline ? (
                      <p
                        className="title-item"
                        onMouseOver={(e) => {
                          e.stopPropagation();
                          item.children.length > 0 || item.products.headline
                            ? handelActiveSubNav(index)
                            : '';
                        }}
                      >
                        {item.title}
                      </p>
                    ) : (
                      <a
                        href={item.relative_url}
                        className="title-item"
                        onMouseOver={(e) => {
                          e.stopPropagation();
                          item.children.length > 0 || item.products.headline
                            ? handelActiveSubNav(index)
                            : '';
                        }}
                      >
                        {item.title}
                      </a>
                    )}
                  </li>
                );
              })}
              <li>
                <div
                  className={`banner-with-detail animated faster ${
                    isSticky ? 'fadeIn' : 'fadeOut'
                  }`}
                >
                  <SearchBox />
                  <button className="btn-login" onClick={handleClickUserIc}>
                    <img src={UserIcon} alt="user-icon" />
                  </button>
                  <BagIcon />
                </div>
              </li>
            </ul>
            {data.map((item: any, index: any) =>
              item.children.length > 0 || item.products.headline ? (
                <SubNavigation
                  isOpen={isOpen.index === index && isOpen.active == true ? true : false}
                  title={item.title}
                  key={index}
                  dataChild={item.children}
                  dataProduct={item.products}
                  closeSubNav={handelCloseSubNav}
                />
              ) : (
                ''
              ),
            )}
            <div
              className={`${isOpen.active == true ? 'mask' : 'mask-hidden'}`}
              onMouseOver={handelCloseSubNav}
            ></div>
          </div>
        </div>
      </section>
      <ProductBag />
      {localStorage.getItem('sundoraToken') ? '' : <LoginModal />}
    </header>
  ) : (
    <></>
  );
}

Navigation.propTypes = {
  data: PropTypes.array.isRequired,
};

export default memo(Navigation);
