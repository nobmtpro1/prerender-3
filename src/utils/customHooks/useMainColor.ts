import { useEffect } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { compute, validateColor } from '../helpers/colorCodeToFilter';

function useMainColor(dataCms: any, ...other: any) {
  const userReducer = useSelector((state: RootStateOrAny) => state.userReducer);

  const user: any = userReducer?.user;

  const getColorImage = (color: any) => {
    if (!color) {
      return;
    }
    if (!validateColor(color)) {
      return;
    }
    return compute(color)?.filterRaw;
  };

  useEffect(() => {
    let mainColor: any = dataCms?.basic_settings?.main_color_general;
    let secondaryColor: any = dataCms?.basic_settings?.separator_color_general;
    let fontColor: any = dataCms?.basic_settings?.font_color_general;

    if (user) {
      mainColor =
        dataCms?.basic_settings?.main_color_registered_user ||
        dataCms?.basic_settings?.main_color_general;
      secondaryColor =
        dataCms?.basic_settings?.separator_color_registered_user ||
        dataCms?.basic_settings?.separator_color_general;
      fontColor =
        dataCms?.basic_settings?.font_color_registered_user ||
        dataCms?.basic_settings?.font_color_general;
    }

    console.log(mainColor, secondaryColor, fontColor);

    const styleElem: any = document.head.appendChild(document.createElement('style'));
    styleElem.setAttribute('id', 'mainColorStyle');
    styleElem.innerHTML = `
      *::-webkit-scrollbar-track,
      SECTION.blk-product DIV.list-product::-webkit-scrollbar-track {
        background: ${mainColor} !important;
      }
      *::-webkit-scrollbar-thumb,
      SECTION.blk-product DIV.list-product::-webkit-scrollbar-thumb {
        background-color: ${secondaryColor} !important;
      }

      html,
      div.navigation-block-mobile .sub-nav,
      div.navigation-block-mobile .sub-nav.active-sub > LI:hover > .last-sub,
      div.navigation-block-mobile,
      .menu-header-mobile,
      .site-allProductPage .checkbox-button__control::after,
      SECTION.filter-box DIV.min-max .input-range .input-range__track--active,
      .site-FilteredProductPage .checkbox-button__control::after,
      .menu-header > .banner-block,
      .banner-block .search-box,
      .menu-header > .navigation-block,
      .menu-header .blk-sub-nav, 
      .navigation-block .search-box,
      .blk-footer {
        background: ${mainColor} !important;
      }
      
      .blk-product-slide .wrapper .sale-inf,
      UL.blk-sub-nav H2,
      .banner-with-detail,
      SECTION.sort-box button.btn-filter-mobile,
      div.navigation-block-mobile .close-nav::after,
      div.navigation-block-mobile,
      .icon-bag .gg-color-bucket,
      .menu-header-mobile .ic-group-right button i,
      .menu-header-mobile .ic-group-right button::after,
      .title-block-default,
      .blk-all-brands,
      .blk-all-brands .box-all-brands box-all-brands__detail ul li a.un-active,
      .blk-filter-results .text-title-filter,
      .breadcrumb,
      .blk-product-slide .item-info,
      .blk-product,
      .blk-countdown,
      .blk-spotlight,
      blk-all-brands,
      .title-block,
      .banner-with-detail input,
      .banner-with-detail input::placeholder,
      .navigation-block .navigation-content__item > .title-item,
      UL.blk-sub-nav .wrapper-sub-menu > UL LI A,
      UL.blk-sub-nav .wrapper-sub-menu > UL LI P,
      .navigation-block .search-box input {
        color: ${fontColor} !important;
      }

      div.navigation-block-mobile .close-nav i::before,
      div.navigation-block-mobile .close-nav i::after,
      .menu-header-mobile .ic-group-right .btn-hamburger i,
      .menu-header-mobile .ic-group-right .btn-hamburger i::before,
      .menu-header-mobile .ic-group-right .btn-hamburger i::after,
      SECTION.filter-box DIV.min-max .input-range .input-range__slider,
      .btn-dot {
        background: ${fontColor} !important;
      }

      div.navigation-block-mobile .navigation-content__item:hover > .title-item,
      SECTION.blk-countdown DIV.wrapper-content DIV.countdown-box Button,
      SECTION.blk-product .btn-add,
      SECTION.blk-spotlight DIV.content .inf .button-box__link,
      SECTION.blk-spotlight DIV.content .title-box__product-name,
      SECTION.blk-all-brands .box-all-brands__detail h2,
      .site-FilteredProductPage .btn-loadmore,
      .loading-product.not-found,
      .react-dropdown-select-input input,
      SECTION.filter-box SECTION.result-filter-box .result-list LI .gg-close,
      SECTION.filter-box SECTION.result-filter-box .result-list LI SPAN,
      .blk-filter-results .btn-clear,
      .wrapper-breadcrumb .blk-icon ul li span,
      .navigation-content__item.active .title-item,
      .blk-sub-nav .recommend-text,
      .navigation-block .navigation-content__item:hover > .title-item,
      UL.blk-sub-nav .wrapper-sub-menu > UL LI A:hover,
      .blk-footer {
        color: ${secondaryColor} !important;
      }

      .icon-bag .badge,
      SECTION.filter-box .wrapper-filter-box,
      .menu-header > .banner-item,
      .btn-dot-active,
      .navigation-block .badge,
      .banner-block .badge,
      .main-content .blk-icon {
        background: ${secondaryColor} !important;
      }

      SECTION.blk-product .sale-inf,
      .input-range__label,
      SECTION.filter-box .wrapper-filter-box,
      .menu-header,
      .main-content .blk-icon,
      .banner-mb-with-shoppingcart ul {
        color: ${mainColor} !important;
      }

      .banner-mb-with-shoppingcart ul li img,
      .main-content .blk-icon img {
        filter: ${getColorImage(mainColor)} !important;
      }

      .site-FilteredProductPage .block-icon-1 SECTION.blk-icon UL LI img,
      .blk-footer .social-group img,
      footer.blk-footer:after,
      .icon.next-icon,
      .icon.prev-icon  {
        filter: ${getColorImage(secondaryColor)} !important;
      }

      .breadcrumb li::after,
      .menu-header-mobile button img,
      .banner-with-detail .gg-search, 
      .banner-with-detail .gg-color-bucket, 
      .banner-with-detail .btn-login {
        filter: ${getColorImage(fontColor)} !important;
      }

      .blk-footer {
        border-top: ${secondaryColor} !important;
      }

      SECTION.blk-product .btn-add,
      SECTION.blk-spotlight DIV.content .inf .button-box__link,
      .site-FilteredProductPage .btn-loadmore,
      SECTION.filter-box SECTION.result-filter-box .result-list LI,
      .site-FilteredProductPage .block-icon-1 SECTION.blk-icon UL LI {
        border: 1px solid ${secondaryColor} !important;
      }

      .site-allProductPage .checkbox-button__control,
      .site-FilteredProductPage .checkbox-button__control {
        border: 2px solid ${mainColor} !important;
      }

      .wrapper-alpha-box::-webkit-scrollbar-track {
        background: ${fontColor} !important;
      }
      .wrapper-alpha-box::-webkit-scrollbar-thumb {
        background-color: ${mainColor} !important;
      }

      .stickyNavMobile .top-nav {
        border-bottom: 1px solid ${secondaryColor} !important;
      }

      @media only screen and (max-width: 1000px) {


      }
    `;

    if (mainColor && secondaryColor) {
      const messenger: any = document.querySelector(`circle`);
      messenger?.setAttribute('fill', mainColor);
      messenger?.nextSibling.firstChild?.setAttribute('fill', secondaryColor);
    }

    return () => {
      styleElem?.remove();
    };
  }, [user, dataCms, ...other]);

  return [];
}

export default useMainColor;
