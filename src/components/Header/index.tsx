import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { fetchCMSHomepage } from '../../redux/Helpers';
import Navigation from '../Navigation';
import NavigationMobile from '../NavigationMobile';
import './styles.scss';
import * as action from '../../redux/home/actions';
import * as navActions from '../../redux/nav/actions';

function Header(): JSX.Element {
  const [dataNav, setDataNav] = useState<any>([]);
  const dispatch = useDispatch();

  const fetchDataInit = async () => {
    try {
      const cmsData = await fetchCMSHomepage('nav/');

      const dataDynamicLinks = get(cmsData, 'dynamic_links');
      const highlightMessage = get(cmsData, 'highlight_message');
      dispatch(action.setGlobalHeaderMessage(highlightMessage));
      setDataNav(dataDynamicLinks?.navigation);

      dispatch(navActions.getNavData(cmsData));
    } catch (error) {}
  };

  useEffect(() => {
    fetchDataInit();
  }, []);

  return (
    <>
      {dataNav && isMobile ? <NavigationMobile data={dataNav} /> : ''}
      {dataNav && !isMobile ? <Navigation data={dataNav} /> : ''}
    </>
  );
}

export default Header;
