import React, { useRef, useState, useEffect, memo, lazy } from 'react';
import { fetchCMSHomepage } from '../../redux/Helpers';
import { map, isEmpty, get } from 'lodash';
import './styles.scss';
import BlockCollectEmail from '../../components/BlockCollectEmail';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import * as action from '../../redux/home/actions';

import { isMobile } from '../../DetectScreen';
import BlockQuestionnaire from '../../components/BlockQuestionnaire';
import BlockTitle from '../../components/BlockTitle';

import DotLoader from '../../components/DotLoader';

const BlockCarousel = lazy(() => import('../../components/BlockCarousel'));
const Footer = lazy(() => import('../../components/Footer'));
const BlockIcon = lazy(() => import('../../components/BlockIcon'));
const BlockProduct = lazy(() => import('../../components/BlockProduct'));
const BlockSpotlight = lazy(() => import('../../components/BlockSpotlight'));
const BlockModal = lazy(() => import('../../components/BlockModal'));
const VideoBlock = lazy(() => import('../../components/BlockVideo'));
const CountDownBlock = lazy(() => import('../../components/BlockCountDown'));
const BlockBlogs = lazy(() => import('../../components/BlockBlogs'));
const Picture = lazy(() => import('../../components/Picture'));
const BlockInstagram = lazy(() => import('../../components/BlockInstagram'));
const BlockFormField = lazy(() => import('../../components/BlockFormField'));

function PageDefault(props: any): JSX.Element {
  const ref = useRef<any>(null);
  const refFooter = useRef<any>(null);

  // const [isSticky, setSticky] = useState(false);
  const [visibleModalEmail, setVisibleModalEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeStamp, setTimeStamp] = useState<any>('');

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

  const [dataNav, setDataNav] = useState<any>([]);
  const [dataFooter, setDataFooter] = useState<any>([]);
  const [dataFormField, setDataFormField] = useState<any>([]);
  const [dataCmsBody, setDataCmsBody] = useState<any>([]);
  const [metaData, setMetaData] = useState<any>({});

  const dispatch = useDispatch();
  const state = useSelector((state: RootStateOrAny) => state.homeReducer);

  const fetchDataInit = async () => {
    if (
      isEmpty(dataNav) ||
      isEmpty(dataFormField) ||
      isEmpty(dataCmsBody) ||
      isEmpty(dataFooter) ||
      isEmpty(metaData)
    ) {
      // this.props.loadingPage(true);
      const slug = props.match.params.idDefaultPage
        ? props.match.params.idDefaultPage
        : undefined;
      const pending = [fetchCMSHomepage(slug)];
      try {
        const results = await Promise.all(pending);
        const cmsData = results[0];
        const dataDynamicLinks = get(cmsData, 'dynamic_links');
        setTimeStamp(cmsData.timestamp);
        setDataCmsBody(cmsData.body);
        setMetaData(cmsData.meta);
        setDataNav(dataDynamicLinks?.navigation);
        setDataFooter(dataDynamicLinks?.footer);
        setDataFormField(cmsData?.form_fields);
        setLoading(false);
        !state.isOpenModalMail
          ? setTimeout(() => {
              setVisibleModalEmail(true);
              dispatch(action.setModalMail(true));
            }, 30000)
          : '';
      } catch (error) {
        // toastrError(error.message);
        // this.props.loadingPage(false);
      }
    }
  };

  useEffect(() => {
    fetchDataInit();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  const handelToggleModal = () => {
    setVisibleModalEmail(!visibleModalEmail);
  };

  const handleKeyPress = () => {
    setVisibleModalEmail(false);
  };
  return (
    <div className="site-homepage">
      {loading ? <DotLoader /> : ''}
      {/* <Banner /> */}
      <div style={{ minHeight: '100vh', paddingTop: '200px' }}>
        {map(dataCmsBody, (item: any, index: any) => {
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
            case 'product':
              return (
                <BlockProduct
                  productList={item?.value.products}
                  title={item?.value?.headline}
                  key={index}
                />
              );
            case 'paragraph':
              return (
                <div className="container" key={index} style={{ padding: '32px 0' }}>
                  <div
                    className="content-paragraph"
                    dangerouslySetInnerHTML={{ __html: item?.value?.text }}
                  ></div>
                </div>
              );
            case 'title':
              return (
                <BlockTitle
                  key={index}
                  title={item?.value?.title}
                  styleDiv={{ padding: '32px 0 0' }}
                />
              );
            case 'images':
              return (
                <div className="container" key={index} style={{ margin: '16px 0 24px 0' }}>
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
            case 'bloglist':
              return <BlockBlogs blogList={item?.value} title="Sundora Blogs" key={index} />;
            case 'form':
              return item?.value?.modal == 'True' ? (
                <BlockModal
                  isOpen={visibleModalEmail}
                  minWidth="36%"
                  maskBg={false}
                  onKeyPress={() => handleKeyPress()}
                  onClickAway={() => handelToggleModal()}
                  key={index}
                >
                  <BlockCollectEmail
                    content={item?.value}
                    formField={dataFormField}
                    url={metaData.html_url}
                    closeModal={handelToggleModal}
                  />
                </BlockModal>
              ) : (
                <BlockFormField
                  content={item?.value}
                  formField={dataFormField}
                  url={metaData.html_url}
                  key={index}
                />
              );
            case 'instagram':
              return <BlockInstagram widgetId={item?.value?.widget} key={index} />;
            case 'questionnaire':
              return <BlockQuestionnaire data={item?.value} key={index} />;
            default:
              break;
          }
        })}
      </div>
      <div ref={refFooter}>
        <Footer data={dataFooter} />
      </div>
    </div>
  );
}

export default memo(PageDefault);
