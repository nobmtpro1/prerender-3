import React, { memo } from 'react';
import Picture from '../Picture';
import { map } from 'lodash';
import { useHistory } from 'react-router-dom';
import { getDiscountedPrice, moneyFormater } from '../../redux/Helpers';
import { PERFUME_TYPE_TAGS, PERFUME_TYPE_MAP } from '../../config';

function ProductSlide(props: any) {
  const history = useHistory();

  const directDetailProduct = (handle: any, brandName: any) => {
    history.push('/brand/' + brandName + '/' + handle);
    props.closeSubNav ? props.closeSubNav() : props.handleCloseShoppingBag();
  };

  const getPerfumeType = (tags: string[]): string => {
    for (let i = 0; i < tags?.length; i++) {
      if (PERFUME_TYPE_TAGS.includes(tags[i].toLowerCase()))
        return PERFUME_TYPE_MAP[tags[i].toLowerCase()];
    }
    return '';
  };

  const getLowestProductPrice = (variants: { price: string }[]): string => {
    const sort = variants.sort(function (a, b) {
      return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    });
    return sort[0].price.toString();
  };

  const willShowDiscount = (item: any): boolean => {
    const show =
      item?.max_discount &&
      item?.max_discount?.value &&
      item?.max_discount?.show_on_detail_page &&
      item?.max_discount?.show_on_homepage;
    return show;
  };

  const countNumberOfDiscount = (item: any) => {
    let count: any = 0;
    item?.product_variants?.forEach((e: any) => {
      if (e?.discount > 0) {
        count++;
      }
    });
    return count;
  };

  const getDiscountPriceOfLowestProductPrice = (variants: any) => {
    const sort = variants?.sort(function (a: any, b: any) {
      return (parseFloat(a?.price) || 0) - (parseFloat(b?.price) || 0);
    });
    console.log(sort[0]?.price, sort[0]?.discount || 0);
    console.log(getDiscountedPrice(sort[0]?.price, sort[0]?.discount || 0));
    return getDiscountedPrice(sort[0]?.price, sort[0]?.discount || 0);
  };

  return (
    <section className="blk-product-slide">
      <div className="x-mandatory">
        {map(props.data, (item, index) => {
          const itemKey = item.value || item;
          const imageKey = itemKey.images ? itemKey.images[0]?.url : itemKey?.image?.url;
          return (
            <div className={`col-${props.col}`} key={index}>
              <div className="wrapper">
                {willShowDiscount(itemKey) && (
                  <span
                    className="sale-inf"
                    style={{
                      visibility: itemKey?.max_discount?.show_on_detail_page
                        ? 'visible'
                        : 'hidden',
                    }}
                  >
                    {countNumberOfDiscount(itemKey) > 1 && 'Up to '}-
                    {itemKey?.max_discount?.value}%
                  </span>
                )}

                <div
                  onClick={() =>
                    !props.isGifItem
                      ? directDetailProduct(
                          !props.closeSubNav ? itemKey.handle : itemKey.handle,
                          itemKey?.brand_page?.page_ptr?.handle,
                        )
                      : ''
                  }
                >
                  <div className="section-square">
                    <Picture data={imageKey ? imageKey : ''} />
                    {item.sale ? <span className="sale-inf">-50%</span> : ''}
                  </div>
                  <div className="item-info">
                    <div>
                      <h4>{itemKey?.brand?.name}</h4>
                      <p>{itemKey?.name}</p>
                      {getPerfumeType(itemKey?.tags) ? (
                        <p className="perfume-type">{getPerfumeType(itemKey?.tags)}</p>
                      ) : null}
                    </div>
                    <div>
                      <div className={itemKey.sale ? 'sale-price' : ''}>
                        From &nbsp;
                        {itemKey?.product_variants && itemKey?.product_variants[0]?.price ? (
                          <span
                            className={`price ${
                              willShowDiscount(itemKey) ? 'strike-through' : ''
                            }`}
                          >
                            {`${moneyFormater(
                              getLowestProductPrice(itemKey?.product_variants),
                            )}`}
                          </span>
                        ) : null}
                      </div>
                      &nbsp;
                      {willShowDiscount(itemKey) ? (
                        <span style={{ marginLeft: '1rem' }} className="discount-price">
                          {getDiscountPriceOfLowestProductPrice(itemKey?.product_variants)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default memo(ProductSlide);
