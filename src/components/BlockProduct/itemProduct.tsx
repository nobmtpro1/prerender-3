import React, { useEffect, useRef, useState } from 'react';
// import icHeart from '../../images/icons/ic-heart.svg';
import Picture from '../Picture';
// import { isMobile } from '../../DetectScreen';
import { useHistory } from 'react-router-dom';
import { getDiscountedPrice, moneyFormater } from '../../redux/Helpers';
import { isDesktop } from 'react-device-detect';
import { find } from 'lodash';
import { PERFUME_TYPE_MAP, PERFUME_TYPE_TAGS } from '../../config';
import { Link } from 'react-router-dom';

const itemProduct = ({
  isInHomePage = false,
  productItem,
  handleModalProduct,
}: {
  isInHomePage?: boolean;
  productItem: any;
  handleModalProduct: any;
}) => {
  const itemProductRef = useRef<any>(null);
  const [image, setImage] = useState<any>({});
  const [video, setVideo] = useState<any>({});
  const keyEndpoint = productItem?.value ? productItem?.value : productItem;

  const history = useHistory();

  const directDetailProduct = (handle: any, brandName: any) => {
    history.push('/brand/' + brandName + '/' + handle);
  };

  const generateLink = (handle: any, brandName: any) => {
    return '/brand/' + brandName + '/' + handle;
  };

  const getLowestProductPrice = (variants: { price: string }[]): string => {
    const sort = variants.sort(function (a, b) {
      return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    });
    return sort[0].price.toString();
  };

  const getDiscountPriceOfLowestProductPrice = (variants: any) => {
    const sort = variants.sort(function (a: any, b: any) {
      return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    });
    return getDiscountedPrice(sort[0]?.price, sort[0]?.discount);
  };

  const getPerfumeType = (tags: string[]): string => {
    for (let i = 0; i < tags.length; i++) {
      if (PERFUME_TYPE_TAGS.includes(tags[i].toLowerCase()))
        return PERFUME_TYPE_MAP[tags[i].toLowerCase()];
    }
    return '';
  };

  useEffect(() => {
    if (itemProductRef && itemProductRef.current) {
      const width = itemProductRef.current.clientHeight;
      const height = itemProductRef.current.clientHeight;
      setImage({
        ...keyEndpoint.images?.[0]?.url,
        width: width,
        height: height,
      });
    }
  }, [keyEndpoint, itemProductRef]);

  useEffect(() => {
    if (keyEndpoint?.product_videos) {
      const videoFirst = find(keyEndpoint.product_videos, (i: any) => i.position == 1);
      setVideo(videoFirst);
    }
  }, [keyEndpoint]);

  const willShowDiscount = (): boolean => {
    let show =
      keyEndpoint?.max_discount &&
      keyEndpoint?.max_discount?.value &&
      keyEndpoint?.max_discount?.show_on_detail_page;

    if (isInHomePage) show = show * keyEndpoint?.max_discount?.show_on_homepage;

    return show;
  };

  const countNumberOfDiscount = () => {
    let count: any = 0;
    keyEndpoint?.product_variants?.forEach((e: any) => {
      if (e?.discount > 0) {
        count++;
      }
    });
    return count;
  };

  return (
    <>
      {keyEndpoint ? (
        <div
          className="product-item-box"
          onClick={() => {
            directDetailProduct(keyEndpoint.handle, keyEndpoint?.brand_page?.page_ptr?.handle);
          }}
        >
          <div className="favorite-box">
            <div></div>
            <span
              className="sale-inf"
              style={{
                visibility: willShowDiscount() ? 'visible' : 'hidden',
              }}
            >
              {countNumberOfDiscount() > 1 && 'Up to '}-{keyEndpoint?.max_discount?.value}%
            </span>
          </div>
          <div className="img-box">
            <Link
              to={generateLink(keyEndpoint.handle, keyEndpoint?.brand_page?.page_ptr?.handle)}
            >
              <div className="img-video-product" ref={itemProductRef}>
                {video ? (
                  <video
                    poster={video?.preview_image}
                    width={'100%'}
                    height={'100%'}
                    autoPlay
                    muted
                    loop
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                ) : (
                  <Picture data={image} />
                )}
              </div>
            </Link>
            <button
              className="btn-quick-view"
              onClick={(e: any) => {
                e.stopPropagation();
                handleModalProduct(keyEndpoint);
              }}
            >
              QUICK VIEW
            </button>
          </div>
          <div className="info">
            <p className="title-item">{keyEndpoint.brand?.name}</p>
            <div className="title-info">
              <h4 className="product-name">{keyEndpoint?.name}</h4>
              <p className="type">
                {keyEndpoint?.tags?.length ? getPerfumeType(keyEndpoint?.tags) : ''}
              </p>
            </div>
          </div>
          <div className="bot">
            <span>
              <span className={productItem.sale ? 'sale-price' : ''}>
                From &nbsp;
                {keyEndpoint?.product_variants && keyEndpoint?.product_variants[0]?.price ? (
                  <span className={`price ${willShowDiscount() ? 'strike-through' : ''}`}>
                    {`${moneyFormater(getLowestProductPrice(keyEndpoint?.product_variants))}`}
                  </span>
                ) : null}
              </span>
              &nbsp;
              {willShowDiscount() ? (
                <span style={{ marginLeft: '1rem' }} className="discount-price">
                  {getDiscountPriceOfLowestProductPrice(keyEndpoint?.product_variants)}
                </span>
              ) : null}
            </span>

            {!isDesktop ? (
              <button
                className="btn-add"
                onClick={(e: any) => {
                  e.stopPropagation();
                  handleModalProduct(keyEndpoint);
                }}
              >
                QUICK VIEW
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

// itemProduct.propTypes = {
//   productItem: PropTypes.object.isRequired,
// };

export default itemProduct;
