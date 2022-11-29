import React, { useEffect, useRef, memo, useState, lazy } from 'react';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux';
import { isMobile } from '../../DetectScreen';
import * as action from '../../redux/home/actions';
import * as actionProduct from '../../redux/product/actions';
import ProductList from './ProductList';
import { filter, find } from 'lodash';
import Loader from '../Loader';
import { moneyFormater } from '../../redux/Helpers';
import { useHistory } from 'react-router-dom';
import { removeProductFromCart } from '../../utils/helpers/productTracker';
import { isMobileSafari } from 'react-device-detect';

const EmptyBag = lazy(() => import('./EmptyBag'));

function ProductBag() {
  const state = useSelector((state: RootStateOrAny) => state.homeReducer);
  const stateProduct = useSelector((state: RootStateOrAny) => state.productReducer);

  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const handleDeleteCheckoutProduct = (variantID: any) => {
    const dataFilter = filter(stateProduct?.lineItems, (i: any) => i.variant_id != variantID);
    const dataFilterVariantRemove = find(
      stateProduct?.lineItems,
      (i: any) => i.variant_id == variantID,
    );

    removeProductFromCart(dataFilterVariantRemove);
    dispatch(actionProduct.deleteLineItems(dataFilter));
  };

  const dispatch = useDispatch();
  const handleCloseShoppingBag = () => {
    dispatch(action.toggleShoppingbag(false));
    document.body.style.overflow = '';
    ref.current.classList.add('slide-out');
  };
  const ref = useRef<any>(null);

  useEffect(() => {
    // localStorage.getItem('sundoraToken') ?
    dispatch(actionProduct.getCheckoutProduct());
    //  : '';

    window.addEventListener('scroll', _handleScroll);
    return () => window.removeEventListener('scroll', _handleScroll);
  }, []);

  useEffect(() => {
    setLoading(stateProduct.loading);
  }, [stateProduct.loading]);

  const [offsetTop, setOffsetTop] = useState(0);

  const _handleScroll = () => {
    setOffsetTop(window.pageYOffset);
  };

  const handleDirectCheckout = () => {
    handleCloseShoppingBag();
    history.push('/checkout');
  };

  const { product } = stateProduct;
  return (
    <>
      <section
        className={`shopping-bag ${state.isOpenShoppingBag ? 'shopping-bag-open' : ''} ${
          isMobileSafari ? 'safari-only' : ''
        }`}
        style={{ top: offsetTop }}
      >
        <div
          className="div-bg-click"
          onClick={handleCloseShoppingBag}
          style={{ top: offsetTop }}
        ></div>
        <div ref={ref} className="layout" style={{ top: !isMobile ? offsetTop : 0 }}>
          <div className="head">
            <h3>Shopping bag</h3>
            <button onClick={handleCloseShoppingBag}>
              <i className="gg-close"></i>
            </button>
          </div>
          <div className="body">
            {loading ? <Loader /> : ''}
            {product?.line_items && product?.line_items.length > 0 ? (
              <ProductList
                data={product?.line_items ? product?.line_items : []}
                discountType={
                  product?.note_attributes && product?.note_attributes.length > 0
                    ? product?.note_attributes[1]?.value
                    : ''
                }
                isGifItem={true}
                DeleteCheckoutProduct={handleDeleteCheckoutProduct}
                handleCloseShoppingBag={handleCloseShoppingBag}
                offerData={product?.variants_offer ? product?.variants_offer : []}
                gifVariantData={product?.gift_variants ? product?.gift_variants : []}
              />
            ) : (
              <EmptyBag
                handleCloseShoppingBag={handleCloseShoppingBag}
                recommendationData={
                  product?.variants_recommendation ? product?.variants_recommendation : []
                }
              />
            )}
          </div>
          <div className="foot">
            {/* <BlockIcon iconList={dataIcons} /> */}
            <div className="checkout-box">
              <div className="total">
                <span>
                  TOTAL{' '}
                  <span style={{ display: isMobile ? 'none' : '' }}>
                    ({product?.line_items?.length || 0} products)
                  </span>
                </span>
                <hr></hr>
                <div>
                  {product?.applied_discount && product?.note_attributes.length > 0 ? (
                    product?.note_attributes[1].value == 'discount_all' ? (
                      <span style={{ color: 'red', marginRight: 8 }}>
                        {product?.applied_discount?.amount
                          ? `- ${moneyFormater(product?.applied_discount?.amount || '')}`
                          : ''}
                      </span>
                    ) : (
                      ''
                    )
                  ) : (
                    ''
                  )}
                  <h3>
                    {product?.subtotal_price_with_rebate
                      ? moneyFormater(product?.subtotal_price_with_rebate)
                      : product?.subtotal_price
                      ? moneyFormater(product?.subtotal_price)
                      : ''}
                  </h3>
                </div>
              </div>
              <button
                style={{
                  cursor: loading || !stateProduct?.lineItems?.length ? 'not-allowed' : '',
                }}
                className={`${loading || !stateProduct?.lineItems?.length ? 'disabled' : ''}`}
                onClick={() => handleDirectCheckout()}
                disabled={!stateProduct?.lineItems?.length}
              >
                Checkout
              </button>
              <button className="continue-shopping" onClick={handleCloseShoppingBag}>
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default memo(ProductBag);
