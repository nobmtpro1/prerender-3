import React, { useEffect, useRef, useState } from 'react';
import BagIcon from '../BagIcon';
import SundoraLogo from '../../images/icons/sundora-logo-vertical.png';
import { map } from 'lodash';
import { Link, useHistory } from 'react-router-dom';
import ProductBag from '../ProductBag';
import * as action from '../../redux/auth/actions';
import UserIcon from '../../images/icons/user-profile.png';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import LoginModal from '../LoginModal';
import SearchBox from '../Banner/SearchBox';
import BlockModal from '../BlockModal';

function NavigationMobile({ data = [] }: { data: any }) {
  const ref = useRef<any>(null);
  const [isSticky, setSticky] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<any>({
    index: null,
    active: false,
  });
  const [isOpenSearchModal, setIsOpenSearchModal] = useState<boolean>(false);
  const [isOpenLastSub, setIsOpenLastSub] = useState<any>({
    index: null,
    active: false,
  });
  const [expandNav, setExpandNav] = useState<boolean>(false);
  const globalConfigReducer = useSelector(
    (state: RootStateOrAny) => state.globalConfigReducer,
  );
  const userReducer = useSelector((state: RootStateOrAny) => state?.userReducer);

  useEffect(() => {
    window.addEventListener('scroll', _handleScroll);
    return () => window.removeEventListener('scroll', _handleScroll);
  }, []);

  const _handleScroll = () => {
    if (ref && ref.current) {
      const offset = window.scrollY;
      // const height = ref.current.clientHeight + 70;
      const height = 0;
      if (offset > height) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    }
  };

  const handelActiveSubNav = (index: any) => {
    if (index == isOpen.index && isOpen.active) {
      setIsOpen({
        index: null,
        active: false,
      });
    } else
      setIsOpen({
        index: index,
        active: true,
      });
  };
  const handelActiveLastSubNav = (index: any) => {
    if (index == isOpenLastSub.index && isOpenLastSub.active) {
      setIsOpenLastSub({
        index: null,
        active: false,
      });
    } else
      setIsOpenLastSub({
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
  const handelCloseLastSubNav = () => {
    if (isOpenLastSub.active) {
      setIsOpenLastSub({
        index: null,
        active: false,
      });
    }
  };

  const toggleNavMobile = () => {
    setExpandNav(!expandNav);
  };

  const history = useHistory();
  const dispatch = useDispatch();

  const handleClickUserIc = () => {
    const AUTH_TOKEN = localStorage.getItem('sundoraToken');
    AUTH_TOKEN
      ? history.push('/account/my-account')
      : dispatch(action.toggleModalLoginActions(true));
  };

  const handleKeyPress = () => {
    setIsOpenSearchModal(false);
  };

  const openModalSearch = () => {
    setIsOpenSearchModal(true);
  };

  return (
    <header className={`div-headerHome-mobile ${isSticky ? 'stickyNavMobile' : ''}`} ref={ref}>
      <div className="menu-header-mobile">
        <div className="top-nav">
          <BagIcon />
          <h1 className="logo-block">
            <Link className="logo" to="/">
              <img
                style={{ paddingTop: 5 }}
                src={
                  globalConfigReducer?.logo ? globalConfigReducer?.logo?.original : SundoraLogo
                }
                width={100}
                height={62}
                alt="sundora-logo"
              />
            </Link>
          </h1>
          <div className="ic-group-right">
            <BlockModal
              isOpen={isOpenSearchModal}
              minWidth="70%"
              maskBg={true}
              onKeyPress={() => handleKeyPress()}
              onClickAway={() => handleKeyPress()}
            >
              <SearchBox closeModalMobile={handleKeyPress} />
            </BlockModal>
            <button onClick={openModalSearch} style={{ padding: 8 }}>
              <i className="gg-search"></i>
            </button>
            <button className="btn-login" onClick={handleClickUserIc}>
              <img src={UserIcon} alt="user-icon" width={30} height={30} />
            </button>
            <button onClick={toggleNavMobile} className="btn-hamburger" data-name="menu">
              <i className="gg-menu-right"></i>
            </button>
          </div>
        </div>
        <div className={`navigation-block-mobile ${expandNav ? 'active' : ''}`}>
          <Link className="logo-sub-menu" to="/">
            <img
              style={{ paddingTop: 5 }}
              src={
                globalConfigReducer?.logo ? globalConfigReducer?.logo?.original : SundoraLogo
              }
              width={100}
              height={62}
              alt="sundora-logo"
            />
          </Link>
          <button onClick={toggleNavMobile} className="close-nav" data-name="back">
            <i className="gg-close"></i>
          </button>
          <ul className="navigation-content">
            {map(data, (item, index) => {
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
                  onClick={() => {
                    handelActiveSubNav(index);
                  }}
                >
                  <p className="title-item">
                    {item.title} <i className="gg-chevron-right"></i>
                  </p>
                  {item.children.length > 0 ? (
                    <ul
                      className={`sub-nav ${
                        isOpen.index === index && isOpen.active == true
                          ? 'active-sub'
                          : 'hidden-sub'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link className="logo-sub-menu" to="/">
                        <img
                          src={
                            globalConfigReducer?.logo
                              ? globalConfigReducer?.logo?.original
                              : SundoraLogo
                          }
                          width={100}
                          height={62}
                          alt="sundora-logo"
                        />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handelCloseSubNav();
                        }}
                        className="close-nav"
                        data-name="back"
                      >
                        <i className="gg-close"></i>
                      </button>
                      {map(item.children, (itemChild, index) => {
                        if (itemChild?.visible_only_to_logged_in_users) {
                          if (!userReducer?.user) {
                            return;
                          }
                        }

                        return (
                          <li
                            key={index}
                            onClick={() => {
                              handelActiveLastSubNav(index);
                            }}
                          >
                            {itemChild?.children.length > 0 ? (
                              <p className="title-item">
                                {itemChild.title} <i className="gg-chevron-right"></i>
                              </p>
                            ) : (
                              <a href={itemChild.relative_url}>
                                <p className="title-item">{itemChild.title}</p>
                              </a>
                            )}
                            {itemChild?.children.length > 0 ? (
                              <ul
                                className={`last-sub ${
                                  isOpenLastSub.index === index && isOpenLastSub.active == true
                                    ? 'active-sub'
                                    : 'hidden-sub'
                                }`}
                              >
                                <Link className="logo-sub-menu" to="/">
                                  <img
                                    src={
                                      globalConfigReducer?.logo
                                        ? globalConfigReducer?.logo?.original
                                        : SundoraLogo
                                    }
                                    width={100}
                                    height={62}
                                    alt="sundora-logo"
                                  />
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handelCloseLastSubNav();
                                  }}
                                  className="close-nav"
                                  data-name="back"
                                >
                                  <i className="gg-close"></i>
                                </button>
                                {map(itemChild?.children, (itemSubChild, index) => {
                                  if (itemSubChild?.visible_only_to_logged_in_users) {
                                    if (!userReducer?.user) {
                                      return;
                                    }
                                  }

                                  return (
                                    <li key={index}>
                                      <a href={itemSubChild.relative_url}>
                                        <span>{itemSubChild.title}</span>
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              ''
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <ProductBag />
      {localStorage.getItem('sundoraToken') ? '' : <LoginModal />}
    </header>
  );
}

export default NavigationMobile;
