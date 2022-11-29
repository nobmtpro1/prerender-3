import React, { useEffect, useRef, useState } from 'react';
import icAddToCart from '../../../images/icons/addToCart-white.svg';
import Picture from '../../Picture';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import * as action from '../../../redux/product/actions';
import * as actionHome from '../../../redux/home/actions';
import { useHistory } from 'react-router-dom';
import { moneyFormater } from '../../../redux/Helpers';
import { addProductToCart } from '../../../utils/helpers/productTracker';

function itemProduct({ productItem }: { productItem: any }) {
  const state = useSelector((state: RootStateOrAny) => state.productReducer);
  const itemProductRef = useRef<any>(null);
  const [image, setImage] = useState({});
  const dispatch = useDispatch();
  const keyEndpoint = productItem?.value ? productItem?.value : productItem;
  const handleCheckoutProduct = (e: any) => {
    e.stopPropagation();
    const variant = keyEndpoint?.product_variants[0] || {};
    const data = {
      // variant_id: 39482168017060,
      variant_id: variant?.variant_id ?? '',
      quantity: 1,
    };
    const index = state?.lineItems.findIndex(function (e: any) {
      return e.variant_id == data.variant_id;
    });
    const copyArr = [...state?.lineItems];

    if (index != -1) {
      const newData = {
        variant_id: data.variant_id,
        quantity: state?.lineItems[index].quantity + data.quantity,
      };
      copyArr[index] = newData;
    } else {
      copyArr.push(data);
    }

    addProductToCart({
      ...keyEndpoint,
      variant_id: variant.variant_id,
      price: variant?.price,
      title: variant?.title,
      quantity: 1,
    });

    dispatch(action.checkoutProduct(copyArr));

    dispatch(actionHome.toggleShoppingbag(true));
  };
  const history = useHistory();

  const directDetailProduct = (handle: any, brandName: any) => {
    history.push('/brand/' + brandName + '/' + handle);
  };

  useEffect(() => {
    if (itemProductRef && itemProductRef.current) {
      const width = itemProductRef.current.clientHeight;
      const height = itemProductRef.current.clientHeight;
      setImage({
        ...keyEndpoint.images[0]?.url,
        width: width,
        height: height,
      });
    }
  }, [keyEndpoint, itemProductRef]);
  return (
    <div
      className="product-item-box"
      // onClick={() => {
      //   directDetailProduct(keyEndpoint.handle, keyEndpoint?.brand_page?.page_ptr?.handle);
      // }}
    >
      <div className="favorite-box">
        {/* <img
          src={icHeart}
          alt=""
          style={{ visibility: !productItem.is_favorite ? 'visible' : 'hidden' }}
        /> */}
        <div></div>

        {keyEndpoint.fixed_rebate ? (
          <span
            className="sale-inf"
            style={{ visibility: keyEndpoint.fixed_rebate > 0 ? 'visible' : 'hidden' }}
          >
            {keyEndpoint.fixed_rebate > 0 ? `-${keyEndpoint.fixed_rebate}%` : ''}
          </span>
        ) : (
          ''
        )}
        {/* <span
          className="sale-inf bonus"
          style={{ display: productItem.bonus ? 'flex' : 'none' }}
        >
          3{' '}
          <span>
            <span>FOR</span> 2
          </span>
        </span> */}
      </div>
      <div className="img-product" ref={itemProductRef}>
        <Picture data={image} />
      </div>
      <div className="bot">
        <div className="row">
          <div className="info">
            <p className="title-item">{keyEndpoint.brand?.name}</p>
            <p className="title-info">{keyEndpoint?.name}</p>
          </div>
        </div>
        <div className="row">
          <div className=" info">
            <span className={`money ${productItem.sale ? 'sale-price' : ''}`}>
              {moneyFormater(keyEndpoint?.product_variants[0].price)}
            </span>
          </div>
        </div>
        <button
          className="btn-detail"
          onClick={() => {
            directDetailProduct(keyEndpoint.handle, keyEndpoint?.brand_page?.page_ptr?.handle);
          }}
        >
          Discover
        </button>
        <button className="btn-add" onClick={handleCheckoutProduct}>
          ADD TO BAG
          <img src={icAddToCart} alt="ic-add-to-cart" />
        </button>
      </div>
    </div>
  );
}

// itemProduct.propTypes = {
//   productItem: PropTypes.object.isRequired,
// };

export default itemProduct;
