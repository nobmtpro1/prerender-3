import React, { memo } from 'react';
import Picture from '../Picture';
import { Link } from 'react-router-dom';
// import { isMobile } from '../../DetectScreen';
import { moneyFormater } from '../../redux/Helpers';
import { getLink } from './getLink';

function renderBlockWithText(data: any) {
  const getLowestProductPrice = (variants: { price: string }[]): string => {
    const sort = variants.sort(function (a, b) {
      return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    });
    return sort[0].price.toString();
  };

  return (
    <>
      <div className="col-md-7 col-12 pr-0" style={{ position: 'relative' }}>
        <Picture data={data[0]?.spot_single_block?.image} />
        <div className="img-product">
          <Picture
            data={data[0]?.product ? data[0]?.product?.images[0]?.url : data[0]?.background}
          />
        </div>
      </div>
      <div className="col-md-5 col-12 pl-0">
        <div className="content">
          {/* <span className="sale-inf">-15%</span> */}
          <div className="title-box">
            {data[0]?.product ? (
              <>
                <p className="title-box__brand-name">{data[0]?.product?.brand?.name}</p>
                <h3 className="title-box__product-name">{data[0]?.product?.name}</h3>
                {data[0]?.product?.product_variants.length > 1 ? (
                  <span>
                    <span className="sale-price">
                      {moneyFormater(data[0]?.product?.product_variants[0].price)} -{' '}
                      {moneyFormater(
                        data[0]?.product?.product_variants[
                          data[0]?.product?.product_variants.length - 1
                        ].price,
                      )}
                    </span>{' '}
                  </span>
                ) : (
                  <span>
                    <span className="sale-price">
                      {`From ${moneyFormater(
                        getLowestProductPrice(data[0]?.product?.product_variants),
                      )}`}
                      {/* {moneyFormater(data[0]?.product?.product_variants[0].price)} */}
                    </span>{' '}
                    {/* {data[0]?.product?.product_variants[0].title &&
                    !isMobile &&
                    data[0]?.product?.product_variants[0].title != 'Default Title' ? (
                      <span className="title-box__variant">
                        / {data[0]?.product?.product_variants[0].title}
                      </span>
                    ) : (
                      ''
                    )} */}
                  </span>
                )}
              </>
            ) : (
              <p className="title-box__title-block">{data[0]?.spot_single_block?.title}</p>
            )}
          </div>
          <div className="inf">
            {/* <p>up to 20% off</p> */}
            <div dangerouslySetInnerHTML={{ __html: data[0]?.spot_single_block?.text }}></div>
            <div className="button-box">
              {data[0]?.link?.link_type === 'external' ? (
                <a
                  target={data[0]?.link?.new_window ? '_blank' : ''}
                  rel={data[0]?.link?.new_window ? 'noopener noreferrer' : ''}
                  href={getLink(data[0])}
                  title={data[0]?.link?.title}
                >
                  <button className="button-box__link">
                    {data[0]?.product ? 'SHOP NOW' : 'DISCOVER'}
                  </button>
                </a>
              ) : (
                <Link
                  target={data[0]?.link?.new_window ? '_blank' : ''}
                  rel={data[0]?.link?.new_window ? 'noopener noreferrer' : ''}
                  // to={
                  //   data[0]?.link && data[0]?.link?.relative_url
                  //     ? `${data[0]?.link?.relative_url}`
                  //     : data[0]?.product
                  //     ? `/brand/${data[0]?.product?.brand_page?.page_ptr?.handle}/${data[0]?.product.handle}`
                  //     : '/'
                  // }
                  to={getLink(data[0])}
                  title={data[0]?.link?.title}
                >
                  <button className="button-box__link">
                    {data[0]?.product ? 'SHOP NOW' : 'DISCOVER'}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function renderBlockWithoutText(data: any) {
  if (data[0]?.link?.link_type === 'external') {
    return (
      <a
        target={data[0]?.link?.new_window ? '_blank' : ''}
        rel={data[0]?.link?.new_window ? 'noopener noreferrer' : ''}
        href={getLink(data[0])}
        title={data[0]?.link?.title}
      >
        <div className="col-md-7 col-12 pr-0 no-content">
          <Picture data={data[0]?.spot_single_block?.image} />
        </div>
      </a>
    );
  } else {
    return (
      <Link
        target={data[0]?.link?.new_window ? '_blank' : ''}
        rel={data[0]?.link?.new_window ? 'noopener noreferrer' : ''}
        to={getLink(data[0])}
        title={data[0]?.link?.title}
      >
        <div className="col-md-7 col-12 pr-0 no-content">
          <Picture data={data[0]?.spot_single_block?.image} />
        </div>
      </Link>
    );
  }
}

function spotlightV1({ data }: { data: any }) {
  return (
    <section
      className={`row spotlight-style spotlight-style-1 shadow-box ${
        data[0]?.spot_single_block?.theme == 'light' ? '' : 'dark-theme'
      }`}
    >
      {!data[0].text && !data[0].product
        ? renderBlockWithoutText(data)
        : renderBlockWithText(data)}
    </section>
  );
}

export default memo(spotlightV1);
