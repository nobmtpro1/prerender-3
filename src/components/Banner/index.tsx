import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SundoraLogo from '../../images/logo.png';
import SearchBox from './SearchBox';
// import './banner.scss';
import BagIcon from '../BagIcon';
import PhoneIcon from '../../images/icons/call.svg';
import FreeShippingIcon from '../../images/icons/freeShipping-white.svg';
import AuthIcon from '../../images/icons/auth-white.svg';
import UserIcon from '../../images/icons/user-profile.png';
import * as action from '../../redux/auth/actions';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PHONE_CONTACT } from '../../config';

function Banner(): JSX.Element {
  const dispatch = useDispatch();
  const history = useHistory();
  const ref = useRef<any>(null);
  const userReducer = useSelector((state: RootStateOrAny) => state.userReducer);
  const globalConfigReducer = useSelector(
    (state: RootStateOrAny) => state.globalConfigReducer,
  );
  // const [isSticky, setSticky] = useState<boolean>(false);
  const [onFooter, setOnFooter] = useState<any>({
    isOnFoot: false,
    bottom: 0,
  });
  const heightFoot = 416;

  useEffect(() => {
    window.addEventListener('scroll', _handleScroll);
    return () => window.removeEventListener('scroll', _handleScroll);
  }, []);

  const _handleScroll = () => {
    if (ref && ref.current) {
      const offset = window.scrollY;
      const siteHeight = window.innerHeight;
      const height = ref.current.clientHeight;

      if (offset > height) {
        const distanceToBottom = siteHeight - offset + height;
        if (distanceToBottom <= heightFoot) {
          setOnFooter({
            ...onFooter,
            isOnFoot: true,
            bottom: heightFoot - distanceToBottom,
          });
        } else {
          setOnFooter({
            ...onFooter,
            isOnFoot: false,
            bottom: 0,
          });
        }
        // setSticky(true);
      } else {
        // setSticky(false);
      }
    }
  };

  const handleClickUserIc = () => {
    const AUTH_TOKEN = localStorage.getItem('sundoraToken');
    AUTH_TOKEN
      ? history.push('/account/my-account')
      : dispatch(action.toggleModalLoginActions(true));
  };

  return (
    <>
      <div className="banner-item banner-mb-with-shoppingcart">
        <ul>
          <li>
            {/* <Link to="/"> */}
            <img src={PhoneIcon} width="12px" />
            <div>{PHONE_CONTACT}</div>
            {/* </Link> */}
          </li>
          <li>
            {/* <Link to="/"> */}
            <img src={FreeShippingIcon} width="30px" />
            <div>free shipping*</div>
            {/* </Link> */}
          </li>
          <li>
            {/* <Link to="/"> */}
            <img src={AuthIcon} width="16px" />
            <div>100% authentic</div>
            {/* </Link> */}
          </li>
        </ul>
      </div>
      <div className={`banner-block`} ref={ref}>
        <div></div>
        <div className="banner-content">
          <h1 className="banner-item banner-with-logo">
            <Link to="/">
              <img
                src={
                  globalConfigReducer?.logo ? globalConfigReducer?.logo?.original : SundoraLogo
                }
                width={135}
                height={83.5}
                alt="sundora-logo"
              />
            </Link>
          </h1>
        </div>
        <div className="banner-with-detail">
          <SearchBox />
          <button className="btn-login" onClick={handleClickUserIc}>
            <img src={UserIcon} alt="user-icon" />
          </button>
          {userReducer?.user?.first_name
            ? `Hi ${userReducer.user?.first_name}`
            : userReducer?.user?.guest
            ? 'Guest'
            : ''}
          <BagIcon />
        </div>
      </div>
    </>
  );
}

export default Banner;
