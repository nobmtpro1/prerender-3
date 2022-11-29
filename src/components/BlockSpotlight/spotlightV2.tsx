import React from 'react';
import Picture from '../Picture';
import { Link } from 'react-router-dom';
import { map } from 'lodash';
import { moneyFormater } from '../../redux/Helpers';
import { getLink } from './getLink';
// import { isMobile } from '../../DetectScreen';

function renderBlockWithContent(item: any, hasText: boolean) {
  const getLowestProductPrice = (variants: { price: string }[]): string => {
    const sort = variants.sort(function (a, b) {
      return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    });
    return sort[0].price.toString();
  };
  return (
    <div className="wrapper-content shadow-box">
      <Picture data={item?.spot_single_block?.image} />
      <div className="img-product">
        <Picture data={item?.product ? item?.product?.images[0]?.url : item?.background} />
      </div>
      <div className="content">
        {/* <span className="sale-inf">-15%</span> */}
        <div className="title-box">
          {item?.product ? (
            <>
              <p className="title-box__brand-name">{item?.product?.brand?.name}</p>
              <h3 className="title-box__product-name">{item?.product?.name}</h3>
              {item?.product?.product_variants.length > 1 ? (
                <span>
                  <span className="title-box__price">
                    {moneyFormater(item?.product?.product_variants[0].price)} -{' '}
                    {moneyFormater(
                      item?.product?.product_variants[
                        item?.product?.product_variants.length - 1
                      ].price,
                    )}
                  </span>{' '}
                </span>
              ) : (
                <span>
                  <span className="title-box__price">
                    {`From ${moneyFormater(
                      getLowestProductPrice(item?.product?.product_variants),
                    )}`}
                    {/* {moneyFormater(item?.product?.product_variants[0].price)} */}
                  </span>{' '}
                  {/* {item?.product?.product_variants[0].title &&
                  !isMobile &&
                  item?.product.product_variants[0].title != 'Default Title' ? (
                    <span className="title-box__variant">
                      / {item?.product.product_variants[0].title}
                    </span>
                  ) : (
                    ''
                  )} */}
                </span>
              )}
            </>
          ) : (
            <p className="title-box__title-block">{item?.title}</p>
          )}
        </div>
        <div className="inf">
          {/* <p>up to 20% off</p> */}
          <div
            dangerouslySetInnerHTML={
              hasText ? { __html: item?.spot_single_block?.text } : { __html: '' }
            }
          ></div>
          <div className="button-box">
            {item?.link?.link_type === 'external' ? (
              <a
                target={item?.link?.new_window ? '_blank' : ''}
                rel={item?.link?.new_window ? 'noopener noreferrer' : ''}
                href={getLink(item)}
                title={item?.link?.title}
              >
                <button className="button-box__link">
                  {item?.product ? 'SHOP NOW' : 'DISCOVER'}
                </button>
              </a>
            ) : (
              <Link
                target={item?.link?.new_window ? '_blank' : ''}
                rel={item?.link?.new_window ? 'noopener noreferrer' : ''}
                // to={
                //   item?.link && item?.link?.relative_url
                //     ? `${item?.link?.relative_url}`
                //     : item?.product
                //     ? `/brand/${item?.product?.brand_page?.page_ptr?.handle}/${item?.product.handle}`
                //     : '/'
                // }
                to={getLink(item)}
                title={item?.link?.title}
              >
                <button className="button-box__link">
                  {item?.product ? 'SHOP NOW' : 'DISCOVER'}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderBlockWithoutContent(item: any) {
  if (!item?.product) {
    if (item?.link?.link_type === 'external') {
      return (
        <a
          target={item?.link?.new_window ? '_blank' : ''}
          rel={item?.link?.new_window ? 'noopener noreferrer' : ''}
          title={item?.link?.title}
          href={getLink(item)}
        >
          <div className="wrapper-content no-content shadow-box">
            <Picture data={item?.spot_single_block?.image} />
          </div>
        </a>
      );
    } else {
      return (
        <Link
          target={item?.link?.new_window ? '_blank' : ''}
          rel={item?.link?.new_window ? 'noopener noreferrer' : ''}
          to={getLink(item)}
          title={item?.link?.title}
          href={'/'}
        >
          <div className="wrapper-content no-content shadow-box">
            <Picture data={item?.spot_single_block?.image} />
          </div>
        </Link>
      );
    }
  } else {
    return renderBlockWithContent(item, false);
  }
}

function spotlightV2({ data }: { data: any }) {
  return (
    <section className="row spotlight-style spotlight-style-2">
      {map(data, (item, index) => (
        <div
          className={`col-md-6 col-12 ${
            item.spot_single_block.theme == 'light' ? '' : 'dark-theme'
          }`}
          key={index}
        >
          {!item?.spot_single_block?.text
            ? renderBlockWithoutContent(item)
            : renderBlockWithContent(item, true)}
        </div>
      ))}
    </section>
  );
}

export default spotlightV2;
