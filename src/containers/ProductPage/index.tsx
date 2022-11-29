import { get, isEmpty, map } from 'lodash';
import moment from 'moment';
import React, { lazy, memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Modal from 'react-modal';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import '../../components/BlockBlogs/block-blogs.scss';
import BlockModal from '../../components/BlockModal';
import BlockProduct from '../../components/BlockProduct';
import BlockQuestionnaire from '../../components/BlockQuestionnaire';
import BlockTitle from '../../components/BlockTitle';
import Picture from '../../components/Picture';
import ProductDetail from '../../components/ProductDetail';
import ProductNoteModal from '../../components/ProductNoteModal';
import {
  GET_PRODUCT_DETAIL,
  GET_WISHLIST,
  NAV_PAGE_SLUG,
  SEO_DESCRIPTION,
} from '../../config';
import { isMobile } from '../../DetectScreen';
import AuthPrimaryIcon from '../../images/icons/auth-primary.png';
import freeShippingPrimaryIcon from '../../images/icons/freeShipping-primary.png';
import starIcon from '../../images/icons/star-regular.svg';
import starSolidIcon from '../../images/icons/star-solid.svg';
import * as action from '../../redux/auth/actions';
import {
  addScriptForProduct,
  fetchClient,
  fetchCMSHomepage,
  getSeoDataFromMetaFields,
  removeScriptProductDetail,
  toastrSuccess,
} from '../../redux/Helpers';
import './styles.scss';
import * as navAction from '../../redux/nav/actions';

const Loader = lazy(() => import('../../components/Loader'));
const Footer = lazy(() => import('../../components/Footer'));
const BlockVideo = lazy(() => import('../../components/BlockVideo'));
const VideoBlock = lazy(() => import('../../components/BlockVideo'));
const BlockIcon = lazy(() => import('../../components/BlockIcon'));
const BlockCarousel = lazy(() => import('../../components/BlockCarousel'));
const BlockSpotlight = lazy(() => import('../../components/BlockSpotlight'));
const CountDownBlock = lazy(() => import('../../components/BlockCountDown'));
const BlockBlogs = lazy(() => import('../../components/BlockBlogs'));

function ProductPage(props: any) {
  const dispatch = useDispatch();
  const [dataNav, setDataNav] = useState<any>([]);
  const [loading, setLoading] = useState<any>([]);
  const [dataFooter, setDataFooter] = useState<any>([]);
  const [visibleModalNote, setVisibleModalNote] = useState(false);
  const [dataModal, setDataModal] = useState<any>([]);
  const [dataProductDetail, setDataProductDetail] = useState<any>({});
  const [dataBrandPage, setDataBrandPage] = useState<any>({});
  const [defaultVariant, setDefaultVariant] = useState([]);
  const [bodyDetailProduct, setBodyDetailProduct] = useState<any>();
  const [timeStamp, setTimeStamp] = useState<any>('');
  const [isWishList, setIsWishList] = useState<any>(false);
  const [dataProductInventoryModal, setDataProductInventoryModal] = useState<any>({});
  const [visibleModalOutStock, setVisibleModalOutStock] = useState<boolean>(false);
  const [image, setImage] = useState<string>('');
  const refFooter = useRef<any>(null);

  const state = useSelector((state: RootStateOrAny) => state.navReducer);
  // const [visibleModalEmail, setVisibleModalEmail] = useState(false);
  // const [dataFormField, setDataFormField] = useState<any>([]);

  const dataIcon = {
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

  const handleKeyPress = () => {
    setVisibleModalNote(false);
  };

  const ref = useRef<any>(null);

  const fetchDataInit = async () => {
    setLoading(true);

    const IDProduct = props.match.params ? props.match.params.IDProduct : undefined;

    const options = {
      url: `${GET_PRODUCT_DETAIL}${IDProduct}/`,
      method: 'GET',
      body: null,
    };
    const optionsInventory = {
      url: `${GET_PRODUCT_DETAIL}${IDProduct}/inventory/`,
      method: 'POST',
      body: null,
    };
    if (
      isEmpty(dataNav) ||
      IDProduct ||
      isEmpty(dataFooter) ||
      isEmpty(defaultVariant) ||
      isEmpty(bodyDetailProduct)
    ) {
      fetchClient(optionsInventory).then((res: any) => {
        if (res?.success) {
          setDataProductInventoryModal(res.data);
        }
      });
      // this.props.loadingPage(true);
      const pending = [fetchClient(options)];
      try {
        const results = await Promise.all(pending);
        const dataProduct = results[0];
        const body = results[0]?.brand_page?.body;
        const brandPage = {
          ...results[0]?.brand_page,
          body: body ? body.filter((item: any) => item?.value?.visible != 'brand') : {},
        };

        // if (
        //   dataProduct?.discount &&
        //   dataProduct?.discount?.value &&
        //   dataProduct?.discount?.show_on_detail_page
        // ) {
        //   setRebate(dataProduct?.discount?.value);
        // }
        setDefaultVariant(dataProduct.product_variants[0]);
        setDataProductDetail(dataProduct);
        setDataBrandPage(brandPage);
        setBodyDetailProduct(dataProduct.body_html);
        setIsWishList(dataProduct?.wishlist?.checked || false);
        // setDataFormField(dataProduct?.brand_page?.form_fields);
        if (dataProduct?.images?.length) {
          setImage(dataProduct.images[0]?.url?.original);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);

        // toastrError(error.message);
        // this.props.loadingPage(false);
      }
    }
  };

  const fetchNavData = async () => await fetchCMSHomepage(NAV_PAGE_SLUG);

  const handleScroll = () => {
    if (ref && ref.current) {
      // const offset = window.pageYOffset + 370;
      const offset = !isMobile
        ? window.pageYOffset + ref.current.clientHeight + 194
        : window.pageYOffset + ref.current.clientHeight + 194 + 186;
      const height = ref.current.getBoundingClientRect().top + ref.current.clientHeight;
      if (offset >= height) {
        // setSticky(true);
        ref.current.classList.add('stick-icon');
      } else {
        ref.current.classList.remove('stick-icon');
        // setSticky(false);
      }

      const scroller = ref;
      const footer = refFooter;
      const scroll_bot =
        scroller.current.getBoundingClientRect().top + scroller.current.clientHeight;
      const footer_top = footer.current.getBoundingClientRect().top;
      if (scroll_bot > footer_top) {
        ref.current.classList.remove('stick-icon');
        scroller.current.classList.add('on-footer');
      } else {
        scroller.current.classList.remove('on-footer');
        scroller.current.style.top = 'unset';
      }
    }
  };

  const handleToggleModal = (data: any) => {
    setDataModal(data);
    setVisibleModalNote(!visibleModalNote);
  };

  const handleAddToWishList = () => {
    if (!localStorage.getItem('sundoraToken')) {
      localStorage.setItem('product_wishlist_id', dataProductDetail?.id);
      dispatch(action.toggleModalLoginActions(true));
      return;
    }
    const options = {
      url: `${GET_WISHLIST}/`,
      method: 'POST',
      body: {
        product_id: dataProductDetail?.id || null,
      },
    };
    fetchClient(options).then((res) => {
      if (res.success) {
        toastrSuccess(res?.message);
      }
    });
  };

  useEffect(() => {
    fetchDataInit();
  }, [props.match.params.IDProduct]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(dataProductDetail)) {
      addScriptForProduct(dataProductDetail);
    }

    return () => {
      removeScriptProductDetail();
    };
  }, [dataProductDetail]);

  useEffect(() => {
    if (isEmpty(state)) {
      setLoading(true);
      try {
        const data = fetchNavData();
        dispatch(navAction.getNavData(data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    } else {
      const dataDynamicLinks = get(state, 'dynamic_links');
      setTimeStamp(state.timestamp);

      setDataNav(dataDynamicLinks?.navigation);
      setDataFooter(dataDynamicLinks?.footer);
    }
  }, [state]);

  const dataVideo = {
    value: {
      text: dataProductDetail?.brand_page?.introduction,
      link: dataProductDetail?.brand_page?.video_link,
      video: {
        publisher: dataProductDetail?.brand_page?.video_publisher,
        id: dataProductDetail?.brand_page?.video,
        file: null,
      },
    },
  };

  const dataReview = {
    count: dataProductDetail?.reviews?.length,
    data: dataProductDetail?.reviews,
  };

  const iconList = [
    {
      text: 'SECURE PAYMENT',
      icon_image: {
        original:
          'https://s.sundora-stage.23c.se/media/images/secure_payment_icon.original.png',
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
        original:
          'https://s.sundora-stage.23c.se/media/images/free_shipping_icon.original.png',
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
        webp:
          'https://s.sundora-stage.23c.se/media/images/auth_icon.original.format-webp.webp',
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

  const SEOData = getSeoDataFromMetaFields(dataProductDetail?.metafields);
  return (
    <div className="site-productPage" itemType="http://schema.org/Product" itemScope={true}>
      <Helmet defer={false}>
        <title>{SEOData.SEOTitle || dataProductDetail?.name}</title>
        <meta property="og:title" content={SEOData.SEOTitle || dataProductDetail?.name} />
        <meta property="og:image" content={image} />
        <meta property="og:image:secure_url" content={image} />
        <meta name="description" content={SEOData.SEODes || SEO_DESCRIPTION} />
        <meta property="og:description" content={SEOData.SEODes || SEO_DESCRIPTION} />
      </Helmet>

      {loading ? <Loader /> : ''}
      {/* <Banner /> */}
      <div className={`container ${isMobile ? 'wrapper-mobile-productpage' : ''}`}>
        {dataProductDetail?.brand_page?.product_banner ? (
          <div className="banner-all-product">
            <Picture data={dataProductDetail?.brand_page?.product_banner} />
          </div>
        ) : (
          ''
        )}

        <div className="breadcrumb">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            {dataProductDetail?.brand_page?.page_ptr ? (
              <li>
                <a
                  href={
                    dataProductDetail?.brand_page?.page_ptr?.relative_url
                      ? `${dataProductDetail?.brand_page?.page_ptr?.relative_url}`
                      : '/'
                  }
                >
                  {dataProductDetail?.brand_page?.page_ptr?.title}
                </a>
              </li>
            ) : (
              ''
            )}
            <li>{dataProductDetail?.name}</li>
          </ul>
        </div>
        <main>
          <div className="row">
            <div className="col-12">
              <ProductDetail
                handleOpenModalNote={handleToggleModal || null}
                handleOutStockProduct={() => setVisibleModalOutStock(true)}
                data={dataProductDetail}
                defaultVariant={defaultVariant}
                inventory={dataProductInventoryModal}
                // bodyDetailProduct={bodyDetailProduct ? bodyDetailProduct : ''}
                isWishListChecked={isWishList}
              />
              <div className="block-icon-1">
                <BlockIcon iconList={dataIcon.value.icons} />
              </div>

              <section className="info-product">
                {/* body_html */}
                {bodyDetailProduct ? (
                  <div dangerouslySetInnerHTML={{ __html: bodyDetailProduct }}></div>
                ) : (
                  ''
                )}
              </section>
              {dataProductDetail?.brand_page?.video_link ? (
                <div className="video-product-detail">
                  <BlockVideo data={dataVideo.value} title="" showReadmore={true} />
                </div>
              ) : (
                ''
              )}

              <section className="review">
                <h3>
                  REVIEW{dataReview?.count > 2 ? 'S' : ''} ({dataReview?.count})
                </h3>
                {map(dataReview?.data, (item: any, index: number) => {
                  return (
                    <div
                      className="comment-box"
                      itemProp="review"
                      itemScope={true}
                      itemType="https://schema.org/Review"
                      key={index}
                    >
                      <div className="evaluate-box">
                        <span className="d-none" itemProp="name">
                          {dataProductDetail?.name}
                        </span>
                        <span
                          className="d-none"
                          itemProp="reviewRating"
                          itemScope={true}
                          itemType="https://schema.org/Rating"
                        >
                          <span itemProp="ratingValue">{item.star}</span>
                        </span>
                        <span
                          className="d-none"
                          itemProp="publisher"
                          itemScope={true}
                          itemType="https://schema.org/Organization"
                        >
                          <meta itemProp="name" content="Bangladesh"></meta>
                        </span>
                        <ul>
                          <li>
                            <span className="star-icon">
                              <img src={item.star < 1 ? starIcon : starSolidIcon} alt="" />
                            </span>
                          </li>
                          <li>
                            <span className="star-icon">
                              <img src={item.star < 2 ? starIcon : starSolidIcon} alt="" />
                            </span>
                          </li>
                          <li>
                            <span className="star-icon">
                              <img src={item.star < 3 ? starIcon : starSolidIcon} alt="" />
                            </span>
                          </li>
                          <li>
                            <button className="star-icon">
                              <img src={item.star < 4 ? starIcon : starSolidIcon} alt="" />
                            </button>
                          </li>
                          <li>
                            <span className="star-icon">
                              <img src={item.star < 5 ? starIcon : starSolidIcon} alt="" />
                            </span>
                          </li>
                        </ul>
                        <p
                          itemProp="author"
                          itemScope={true}
                          itemType="https://schema.org/Person"
                        >
                          By <span itemProp="name"> {item?.name || ''}</span>
                          {` - ${moment(item.created_at).format('MMM YYYY')}`}
                        </p>
                        <meta
                          itemProp="datePublished"
                          content={moment(item.created_at).format('y-MM-DD')}
                        ></meta>
                        <p
                          style={{ fontWeight: 700, color: 'rgb(42 103 107)', marginLeft: 6 }}
                        >
                          - VERIFIED CUSTOMER
                        </p>
                      </div>
                      <p itemProp="reviewBody">{item?.comment}</p>
                    </div>
                  );
                })}
              </section>
            </div>
          </div>
        </main>
      </div>
      <div style={{ paddingBottom: '85px' }}>
        {map(dataBrandPage?.body, (item: any, index: any) => {
          switch (item.type) {
            case 'carousel':
              return (
                <BlockCarousel
                  slides={item && item.value ? item?.value.slides : []}
                  key={index}
                  dragOrAuto={false}
                  maxWidth={item && item.value ? item?.value.max_width : ''}
                />
              );
            case 'spotlight':
              return (
                <BlockSpotlight
                  headline={item?.value.headline}
                  items={item?.value.rows}
                  key={index}
                />
              );
            case 'countdown':
              return <CountDownBlock data={item?.value} key={index} timestamp={timeStamp} />;
            case 'paragraph':
              return (
                <div className="container" key={index}>
                  <div
                    className="content-block"
                    dangerouslySetInnerHTML={{ __html: item?.value?.text }}
                  ></div>
                </div>
              );
            case 'title':
              return <BlockTitle key={index} title={item?.value?.title} />;
            case 'video':
              return (
                <VideoBlock
                  data={item?.value}
                  title={item?.value?.title || ''}
                  showReadmore={true}
                  key={index}
                />
              );
            case 'icons':
              return (
                <div
                  // className={`main-content ${isSticky ? 'stick-icon' : ''}`}
                  className="main-content"
                  ref={ref ? ref : ''}
                  key={index}
                >
                  <BlockIcon iconList={item.value?.icons || []} />
                </div>
              );
            case 'images':
              return (
                <div className="container" key={index}>
                  <div className="images-box-default">
                    <div className="wrapper-img row-span">
                      <Picture data={item?.value?.images?.big} />
                    </div>
                    <div className="wrapper-img">
                      <Picture data={item?.value?.images?.top_left} />
                    </div>
                    <div className="wrapper-img">
                      <Picture data={item?.value?.images?.bottom_left} />
                    </div>
                  </div>
                </div>
              );
            case 'product':
              return (
                <BlockProduct
                  productList={item?.value.products}
                  title={item?.value?.headline}
                  key={index}
                />
              );
            case 'bloglist':
              return <BlockBlogs blogList={item?.value} title="Sundora Blogs" key={index} />;
            case 'recommended':
              return (
                <BlockProduct
                  productList={item?.value?.products}
                  title={item?.value?.headline}
                  key={index}
                />
              );
            case 'questionnaire':
              return <BlockQuestionnaire data={item?.value} key={index} />;
            default:
              break;
          }
        })}
      </div>
      <div
        // className={`main-content ${isSticky ? 'stick-icon' : ''}`}
        className="main-content"
      >
        <BlockIcon iconList={iconList} />
      </div>
      {visibleModalNote ? (
        <BlockModal
          isOpen={visibleModalNote}
          minWidth="70%"
          maskBg={true}
          onKeyPress={() => handleKeyPress()}
          onClickAway={() => handleToggleModal(null)}
        >
          <ProductNoteModal data={dataModal} />
        </BlockModal>
      ) : (
        ''
      )}
      {/* Product out stock modal */}
      <Modal
        isOpen={visibleModalOutStock}
        ariaHideApp={false}
        onRequestClose={() => setVisibleModalOutStock(false)}
        style={{ overlay: { zIndex: 99, background: 'rgba(0, 0, 0, 0.35)' } }}
        className="modal-outstock-view__content"
      >
        <div className="box-warning">
          <div className="col-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-close"
              type="button"
              onClick={() => setVisibleModalOutStock(false)}
            ></button>
          </div>
          <div className="box-content">
            <p className="warning">Warning</p>
            <p className="description">
              Sorry! This product is out of stock, click on the button below to get notified
              when it is back!
            </p>
            <button className="btn-add-to-wishlist" onClick={handleAddToWishList}>
              Notify me
            </button>
          </div>
        </div>
      </Modal>
      <div ref={refFooter}>
        <Footer data={dataFooter} />
      </div>
    </div>
  );
}

export default memo(ProductPage);
