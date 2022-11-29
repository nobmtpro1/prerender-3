import React, { memo, useState } from 'react';
import Quantity from './Quantity';
import _, { map } from 'lodash';
import { isMobileOnly } from '../../DetectScreen';
import { getAppliedDiscountedPrice, moneyFormater } from '../../redux/Helpers';
import Picture from '../Picture';
import ProductSlide from '../ProductSlide';

function ProductList(props: any) {
  const [isShowOffer, setIsShowOffer] = useState<any>(true);
  const handleDeleteProductBag = (variantID: any) => {
    props.DeleteCheckoutProduct(variantID);
  };
  return (
    <>
      <ul>
        <li className="header-card">
          <div></div>
          <span>Product</span>
          <span>Quantity</span>
          <span>Price</span>
        </li>
      </ul>
      <ul className="wrapper-items">
        {map(props.data, (item, index) => {
          return (
            <li className="product-item" key={index}>
              <div className="item">
                <div className="product-img">
                  <div className="section-square">
                    {item?.image ? <Picture data={item?.image?.url} /> : ''}
                  </div>
                </div>
                <div className="product-inf">
                  <h4>{item?.vendor}</h4>
                  <p>{item?.title}</p>
                  <p className="capacity">{item?.variant_title}</p>
                </div>
                <div className="quantity">
                  <Quantity
                    quantity={item?.quantity}
                    variantId={item?.variant_id}
                    variant={item}
                    isDisabled={
                      _.find(item.properties, (i) => i.name == 'variant_gift') ? true : false
                    }
                  />
                </div>
                <div className="price">
                  <button
                    className="remove-item"
                    onClick={() => handleDeleteProductBag(item?.variant_id)}
                  >
                    <i className="gg-close"></i>
                  </button>
                  {isMobileOnly ? (
                    <div className="quantity quantity-mobile">
                      <Quantity
                        quantity={item?.quantity}
                        variantId={item?.variant_id}
                        variant={item}
                      />
                    </div>
                  ) : (
                    ''
                  )}

                  <h4 className="discount">
                    <p
                      style={{ whiteSpace: 'nowrap' }}
                      className={
                        item?.applied_discount?.value?.length > 0
                          ? `price strike-through`
                          : 'price'
                      }
                    >
                      {moneyFormater(item?.price * item?.quantity || '')}
                    </p>
                    {item?.applied_discount?.amount?.length > 0 && (
                      <p className="price">
                        {getAppliedDiscountedPrice(
                          (item?.price * item?.quantity).toString(),
                          item?.applied_discount?.amount,
                        )}
                      </p>
                    )}
                  </h4>
                </div>
              </div>
            </li>
          );
        })}
        {props.gifVariantData && props.gifVariantData.length > 0 ? (
          <li
            className={`product-item offer-box animation faster ${
              isShowOffer ? '' : 'fadeOut'
            }`}
          >
            <button
              className="remove-offer"
              onClick={() => {
                setIsShowOffer(false);
              }}
            >
              <i className="gg-close"></i>
            </button>
            <h4>Your gift:</h4>
            <ProductSlide
              data={props.gifVariantData}
              col={3}
              handleCloseShoppingBag={props.handleCloseShoppingBag}
              isGifItem={true}
            />
          </li>
        ) : (
          ''
        )}
        {props.offerData && props.offerData.length > 0 && !props.gifVariantData ? (
          <li
            className={`product-item offer-box animation faster ${
              isShowOffer ? '' : 'fadeOut'
            }`}
          >
            <button
              className="remove-offer"
              onClick={() => {
                setIsShowOffer(false);
              }}
            >
              <i className="gg-close"></i>
            </button>
            <h4> Special offers for you:</h4>
            <ProductSlide
              data={props.offerData}
              col={3}
              handleCloseShoppingBag={props.handleCloseShoppingBag}
            />
          </li>
        ) : (
          ''
        )}
      </ul>
    </>
  );
}
export default memo(ProductList);
