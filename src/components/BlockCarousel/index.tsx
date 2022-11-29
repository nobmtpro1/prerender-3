import React, { memo, useEffect, useState } from 'react';
import Picture from '../Picture';
import Slider from '../Slider';
import { isMobile, isTablet } from '../../DetectScreen';
import CarouselVideo from '../CarouselVideo';
import { fetchClient } from '../../redux/Helpers';
import { GET_PRODUCT_DETAIL } from '../../config';
import routes from '../../routes/routeModel';
import { RootStateOrAny, useSelector } from 'react-redux';

function Carousel({
  slides,
  dragOrAuto = false,
  maxWidth,
  maxHeight,
  hasText = false,
}: {
  slides: any;
  dragOrAuto: boolean;
  maxWidth?: string;
  maxHeight?: string;
  hasText?: boolean;
}): JSX.Element {
  const [indexSlide, setIndexSlide] = useState(0);
  const [productLinks, setProductLinks] = useState([]);

  const userReducer = useSelector((state: RootStateOrAny) => state?.userReducer);

  useEffect(() => {
    async function fetch() {
      const routeProductPage: any = routes?.find(
        (route) => route.name == 'Product Detail Page',
      )?.path;
      const pending: any = [];
      const productLinkArr: any = [];
      if (slides?.length > 0) {
        slides.forEach((slide: any, i: any) => {
          if (slide?.product) {
            const obj: any = {};
            obj.index = i;
            obj.productLink = slide?.product;
            productLinkArr.push(obj);
            const options = {
              url: `${GET_PRODUCT_DETAIL}${slide?.product?.id}/`,
              method: 'GET',
              body: null,
            };
            pending.push(fetchClient(options));
          }
        });
      }
      try {
        const productLinks: any = [];
        const results = await Promise.all(pending);
        results.forEach((product: any) => {
          const obj: any = {};
          obj.id = product.id;
          obj.url = routeProductPage
            .replace(':IDBrand', product?.brand_page?.page_ptr?.slug)
            .replace(':IDProduct', product.handle);
          productLinks.push(obj);
        });
        setProductLinks(productLinks);
      } catch {}
    }

    fetch();
  }, [slides]);

  const sliderHeight = isTablet ? 135 : isMobile ? 120 : window.innerHeight - 192;
  const defaultHeight = 737; // max-height applied for large screen;

  const handleClickCarousel = (href: any, loginPopup: any) => {
    if (loginPopup) {
      const btnLogins: any = document.querySelectorAll(`.btn-login`);
      btnLogins?.forEach((btnLogin: any) => {
        btnLogin.click();
      });
      return;
    }
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <section className="blk-carousel">
      <div
        className={`carousel-block ${hasText && 'has-text'}`}
        style={{
          maxWidth: maxWidth ? `${maxWidth}px` : '',
          maxHeight: (sliderHeight > defaultHeight ? defaultHeight : sliderHeight) + 'px',
          height: sliderHeight,
        }}
      >
        <Slider
          onSlideComplete={setIndexSlide}
          // onSlideStart={(i) => {
          //   console.log('started dragging on slide', i);
          // }}
          activeIndex={indexSlide}
          threshHold={isMobile ? 100 : 500}
          transition={isMobile ? 0.2 : 0.8}
          scaleOnDrag={false}
          isSquare={false}
          dragOrAuto={dragOrAuto}
          slideInterval={5000}
        >
          {slides
            ?.filter((slide: any) => {
              if (slide?.show_only_for_user == 'logged_in_user_only') {
                if (!userReducer?.user) {
                  return false;
                }
              }
              if (slide?.show_only_for_user == 'guest_user_only') {
                if (userReducer?.user) {
                  return false;
                }
              }
              return true;
            })
            ?.map((item: any, index: number) => {
              const productLink: any = productLinks?.find(
                (x: any) => x?.id == item?.product?.id,
              );
              return (
                <div key={index} className="animated faster fadeIn">
                  {dragOrAuto ? (
                    <a
                      className="nav-link-full-img"
                      onClick={() =>
                        handleClickCarousel(
                          item?.link
                            ? item?.link?.full_url
                            : productLink
                            ? productLink?.url
                            : '',
                          item?.login_popup,
                        )
                      }
                    ></a>
                  ) : (
                    ''
                  )}
                  {item.video && item.video.src.length ? (
                    <CarouselVideo src={item.video.src[0].src} type={item.video.src[0].type} />
                  ) : (
                    <Picture
                      data={{ ...item.background, maxHeight: maxHeight, maxWidth: maxWidth }}
                    />
                  )}
                  {item?.text ? (
                    <div
                      className="content-slide"
                      dangerouslySetInnerHTML={{ __html: item?.text }}
                    ></div>
                  ) : (
                    ''
                  )}
                </div>
              );
            })}
        </Slider>
      </div>
    </section>
  );
}

export default memo(Carousel);
