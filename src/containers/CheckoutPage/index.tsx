import axios from 'axios';
import _, { filter, find, get, isEmpty } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../components/BlockBlogs/block-blogs.scss';
import CheckoutForm from '../../components/CheckoutForm';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import EmptyBag from '../../components/ProductBag/EmptyBag';
import ProductList from '../../components/ProductBag/ProductList';
import {
  GET_AFFILIATE_CODE_CHECK_EXIST,
  GET_SUNDORA_VIP,
  GET_VOUCHER,
  PUT_DISCOUNT_CODE,
  PUT_PLACE_ORDER_CHECKOUT,
} from '../../config';
import {
  fetchClient,
  fetchCMSHomepage,
  moneyFormater,
  toastrError,
  toastrSuccess,
} from '../../redux/Helpers';
import * as actionHome from '../../redux/home/actions';
import * as actionProduct from '../../redux/product/actions';
import { checkoutProductSuccess, setLineItems } from '../../redux/product/actions';
import { beginCheckout, removeProductFromCart } from '../../utils/helpers/productTracker';
import './styles.scss';

function CheckoutPage(props: any) {
  const stateProduct = useSelector((state: RootStateOrAny) => state.productReducer);
  const stateUser = useSelector((state: RootStateOrAny) => state.userReducer);

  const dispatch = useDispatch();
  const [dataNav, setDataNav] = useState<any>([]);
  const [loading, setLoading] = useState<any>([]);
  const [dataFooter, setDataFooter] = useState<any>([]);
  const [discountCode, setDiscountCode] = useState<string>(
    stateProduct?.product?.applied_discount?.title || '',
  );
  const [affiliateCode, setAffiliateCode] = useState<any>(null);
  const [submitAffiliateCodeLoading, setSubmitAffiliateCodeLoading] = useState<any>(false);

  const [loadingDiscount, setLoadingDiscount] = useState<boolean>(false);
  const [dataSundoraVIP, setDataSundoraVIP] = useState<any>();
  const [discountCodeAdded, setDiscountCodeAdded] = useState<boolean>(false);
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

  const fetchDataInit = async () => {
    const slug = props.match.params ? props.match.params : undefined;
    const draft_order_id = localStorage.getItem('id_checkout')
      ? localStorage.getItem('id_checkout')
      : null;
    if (localStorage.getItem('sundoraToken')) {
      dispatch({ type: 'GET_ADDRESS' });
    }
    if (isEmpty(dataNav) || slug || isEmpty(dataFooter)) {
      const optionsVoucher = {
        url: `${GET_VOUCHER}${draft_order_id}/order/`,
        method: 'GET',
        body: null,
        toaster: !!stateUser?.user,
      };

      const pending = [fetchCMSHomepage('blogs-page'), fetchClient(optionsVoucher)];

      try {
        const results = await Promise.all(pending);
        const cmsData = results[0];
        const dataDynamicLinks = get(cmsData, 'dynamic_links');
        setDataNav(dataDynamicLinks?.navigation);
        setDataFooter(dataDynamicLinks?.footer);
        setLoading(false);
      } catch (error) {}
    }
    if (isEmpty(dataSundoraVIP)) {
      const options = {
        url: `${GET_SUNDORA_VIP}`,
        method: 'GET',
        body: null,
        toaster: !!stateUser?.user,
      };
      try {
        const res = await fetchClient(options);
        if (res?.success) {
          setDataSundoraVIP(res?.data);
          setLoading(false);
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    fetchDataInit();
  }, [stateProduct]);

  useEffect(() => {
    setAffiliateCode(stateProduct?.product?.affiliate);
  }, [stateProduct]);

  const handleChangeDiscount = (e: any) => {
    setDiscountCode(e.target.value);
    setDiscountCodeAdded(false);
    handleDeleteDiscount(e);
  };

  const handleSubmitVoucher = (voucher: any) => {
    setDiscountCode('');
    if (loadingDiscount) {
      return;
    }
    const draft_order_id = localStorage.getItem('id_checkout')
      ? localStorage.getItem('id_checkout')
      : null;
    setLoadingDiscount(true);
    if (draft_order_id) {
      const options = {
        url: `${PUT_DISCOUNT_CODE}${draft_order_id}/discount_loyalty_code/`,
        method: 'PUT',
        body: {
          discount: {
            voucher_id: voucher.id,
          },
        },
      };

      fetchClient(options).then((res) => {
        if (res?.success) {
          dispatch(setLineItems(res?.data.line_items));
          dispatch(checkoutProductSuccess(res?.data));
          setDiscountCodeAdded(false);
          setLoadingDiscount(false);
        } else if (res?.isError) {
          setLoadingDiscount(false);
          return;
        }
      });
    }
  };

  const handleSubmitDiscount = () => {
    const draft_order_id = localStorage.getItem('id_checkout')
      ? localStorage.getItem('id_checkout')
      : null;
    setLoadingDiscount(true);
    if (draft_order_id) {
      const options = {
        url: `${PUT_DISCOUNT_CODE}${draft_order_id}/discount_code/`,
        method: 'PUT',
        body: {
          discount: {
            code: discountCode,
          },
        },
      };

      fetchClient(options).then((res) => {
        if (res?.success) {
          const discountType = _.find(
            res.data?.note_attributes,
            (i) => i.value == 'discount_buy_x_get_y',
          );
          if (discountType) {
            dispatch(actionHome.toggleShoppingbag(true));
          }
          dispatch(setLineItems(res?.data.line_items));
          dispatch(checkoutProductSuccess(res?.data));
          setDiscountCodeAdded(true);
          setLoadingDiscount(false);
        } else if (res?.isError) {
          toastrError(res?.message?.discount_code);
          setLoadingDiscount(false);
          return;
        }
      });
    }
  };
  const handleDeleteDiscount = (data: any) => {
    if (loadingDiscount) {
      return;
    }
    const draft_order_id = localStorage.getItem('id_checkout')
      ? localStorage.getItem('id_checkout')
      : null;
    setLoadingDiscount(true);
    if (draft_order_id) {
      const options = {
        url: `${PUT_DISCOUNT_CODE}${draft_order_id}/discount_code_delete/`,
        method: 'DELETE',
        body: null,
      };

      fetchClient(options).then((res) => {
        if (res?.success) {
          dispatch(setLineItems(res?.data.line_items));
          dispatch(checkoutProductSuccess(res?.data));
          if (discountCodeAdded) handleSubmitVoucher(data);
          setLoadingDiscount(false);
        } else if (res?.isError) {
          setLoadingDiscount(false);
          return;
        }
      });
    }
  };

  const handleDeleteDiscountAndShippingAddress = () => {
    const { product } = stateProduct;
    const draft_order_id = localStorage.getItem('id_checkout')
      ? localStorage.getItem('id_checkout')
      : null;
    setLoadingDiscount(true);
    const dcFreeShipping = find(
      product?.note_attributes,
      (i) => i.name == 'discount_code_type' && i.value == 'discount_free_shipping',
    );
    if (draft_order_id) {
      const optionsRemoveShippingAddress = {
        url: `${PUT_DISCOUNT_CODE}${draft_order_id}/remove_shipping_address/`,
        method: 'DELETE',
        body: null,
      };
      if (dcFreeShipping) {
        const options = {
          url: `${PUT_DISCOUNT_CODE}${draft_order_id}/discount_code_delete/`,
          method: 'DELETE',
          body: null,
        };

        fetchClient(options).then((res) => {
          if (res?.success) {
            fetchClient(optionsRemoveShippingAddress).then((res) => {
              if (res.success) {
                dispatch(setLineItems(res?.data.line_items));
                dispatch(checkoutProductSuccess(res?.data));
                setLoadingDiscount(false);
              } else if (res?.isError) {
                setLoadingDiscount(false);
                return;
              }
            });
          } else if (res?.isError) {
            setLoadingDiscount(false);
            return;
          }
        });
      } else {
        fetchClient(optionsRemoveShippingAddress).then((res) => {
          if (res.success) {
            dispatch(setLineItems(res?.data.line_items));
            dispatch(checkoutProductSuccess(res?.data));
            setLoadingDiscount(false);
          } else if (res?.isError) {
            setLoadingDiscount(false);
            return;
          }
        });
      }
    }
  };
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState<boolean>(false);
  const handleClickPlaceOrder = () => {
    if (loadingPlaceOrder) {
      return;
    }
    const checkoutID = localStorage.getItem('id_checkout');

    const body = stateProduct.placeOrderForm;
    body.cash_on_pickup = false;

    const guest = !!localStorage.getItem('sundora_guest_id');
    if (guest) body.user_id = localStorage.getItem('sundora_guest_id');

    if (body.multi_card_name == 'cod') {
      body.cash_on_pickup = true;
    }

    if (!localStorage.getItem('sundoraToken') && !guest) {
      toastrError('Please login to proceed');
      return;
    }
    if (body?.address_id == null && body?.store_location_id == null) {
      toastrError('Please choose delivery address');
      return;
    }
    if (!body?.multi_card_name) {
      toastrError('Please choose payment option');
      return;
    }
    setLoadingPlaceOrder(true);

    const options = {
      url: `${PUT_PLACE_ORDER_CHECKOUT}${checkoutID}/pay/`,
      method: 'POST',
      body: body,
      guest,
    };
    fetchClient(options)
      .then((res) => {
        if (res?.success) {
          if (res?.data?.type == 'cash_on_pickup') {
            window.location.href = `order-verify/success/${res?.data?.order}/`;
            return;
          }
          beginCheckout(stateProduct);
          window.location.href = res.data.redirectGatewayURL;
        }
        setLoadingPlaceOrder(false);
        if (res?.isError) {
          toastrError(res?.message);
        }
      })
      .catch((err: any) => console.log(err));
  };

  const handleDeleteCheckoutProduct = (variantID: any) => {
    const dataFilter = filter(stateProduct?.lineItems, (i: any) => i.variant_id != variantID);
    const dataFilterVariantRemove = find(
      stateProduct?.lineItems,
      (i: any) => i.variant_id == variantID,
    );

    removeProductFromCart(dataFilterVariantRemove);
    dispatch(actionProduct.deleteLineItems(dataFilter));
  };

  useEffect(() => {
    setLoading(stateProduct.loading);
  }, [stateProduct.loading]);

  const { product } = stateProduct;

  const onAgree = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAgreed(event.target.checked);
  };

  const handleSubmitAffiliateCode = () => {
    setSubmitAffiliateCodeLoading(true);
    axios
      .get(
        GET_AFFILIATE_CODE_CHECK_EXIST +
          `?affiliate_code=${affiliateCode?.code}&draft_order_id=${stateProduct?.product?.id}`,
      )
      .then((res: any) => {
        setAffiliateCode(res.data?.data?.affiliate);
        toastrSuccess('Apply affiliate code successfully');
        setSubmitAffiliateCodeLoading(false);
        dispatch(actionProduct.getCheckoutProduct());
      })
      .catch(() => {
        toastrError('Affiliate code does not exist');
        setSubmitAffiliateCodeLoading(false);
      });
  };

  return (
    <div className="site-CheckoutPage">
      {loading ? <Loader /> : ''}
      <Helmet>
        <meta property="og:title" content="Checkout page | Sundora" />
        <meta property="og:description" content="Checkout page | Sundora" />
        <title>Checkout page | Sundora</title>
        <meta name="description" content="Checkout page | Sundora" />
      </Helmet>
      <main>
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-12" style={{ borderRight: '1px solid #dddddd' }}>
              <CheckoutForm
                draftOrder={product}
                placeOrderForm={stateProduct?.placeOrderForm}
                handleDeleteDiscountAndShippingAddress={handleDeleteDiscountAndShippingAddress}
              />
            </div>
            <div className="col-md-6 col-12">
              <section className="shopping-bag checkout-bag-layout">
                <div>
                  <div className="head">
                    <h3>Shopping bag</h3>
                  </div>
                  <div className="body">
                    {product?.line_items ? (
                      <ProductList
                        data={product?.line_items ? product?.line_items : []}
                        DeleteCheckoutProduct={handleDeleteCheckoutProduct}
                        discountType={
                          product?.note_attributes && product?.note_attributes.length > 0
                            ? product?.note_attributes[1]?.value
                            : ''
                        }
                        offerData={
                          product?.variants_recommendation
                            ? product?.variants_recommendation
                            : []
                        }
                      />
                    ) : (
                      <EmptyBag />
                    )}
                  </div>
                  <div className="foot">
                    <div className="checkout-box">
                      <h4>Discount:</h4>
                      <div className="discount-box" style={{ marginTop: '10px' }}>
                        <input
                          type="text"
                          onChange={handleChangeDiscount}
                          placeholder="Enter discount code"
                          value={discountCode}
                        />
                        <button
                          onClick={
                            find(
                              stateProduct?.product?.note_attributes,
                              (item) => item.name == 'discount_code',
                            )?.value
                              ? handleDeleteDiscount
                              : handleSubmitDiscount
                          }
                          disabled={!discountCode.length}
                        >
                          {find(
                            stateProduct?.product?.note_attributes,
                            (item) => item.name == 'discount_code',
                          )?.value
                            ? 'Changed discount'
                            : 'submit'}
                        </button>
                        {loadingDiscount ? (
                          <div className="lds-roller">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <h4>Affiliate code:</h4>
                      <div className="discount-box" style={{ marginTop: '10px' }}>
                        <input
                          type="text"
                          onChange={(e: any) =>
                            setAffiliateCode((prev: any) => ({
                              ...prev,
                              code: e?.target?.value,
                            }))
                          }
                          placeholder="Enter affiliate code"
                          value={affiliateCode?.code}
                        />
                        <button
                          onClick={handleSubmitAffiliateCode}
                          disabled={!affiliateCode?.code?.length}
                        >
                          Submit
                        </button>
                        {affiliateCode?.successful_text && (
                          <div className="affiliate-successful-text">
                            {affiliateCode?.successful_text}
                          </div>
                        )}
                        {submitAffiliateCodeLoading ? (
                          <div className="lds-roller">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <br />
                      <div className="info-checkout">
                        {product?.applied_discount && product?.note_attributes.length > 0 ? (
                          product?.note_attributes[1].value == 'discount_all' ? (
                            <div className="d-flex">
                              <span>Price</span>
                              <span>
                                {product?.subtotal_price
                                  ? moneyFormater(
                                      parseInt(product?.subtotal_price) +
                                        parseInt(product?.applied_discount?.amount || 0),
                                    )
                                  : '0,00'}
                              </span>
                            </div>
                          ) : (
                            <div className="d-flex">
                              <span>Price</span>
                              <span>
                                {product?.subtotal_price_with_rebate
                                  ? moneyFormater(product?.subtotal_price_with_rebate)
                                  : product?.subtotal_price
                                  ? moneyFormater(product?.subtotal_price)
                                  : '0,00'}
                              </span>
                            </div>
                          )
                        ) : (
                          <div className="d-flex">
                            <span>Price</span>
                            <span>
                              {product?.subtotal_price_with_rebate
                                ? moneyFormater(product?.subtotal_price_with_rebate)
                                : product?.subtotal_price
                                ? moneyFormater(product?.subtotal_price)
                                : '0,00'}
                            </span>
                          </div>
                        )}
                        {product?.applied_discount ? (
                          <div className="d-flex discount-all">
                            <span>Price discounted</span>
                            <span>
                              {product?.applied_discount?.amount
                                ? `- ${moneyFormater(product?.applied_discount?.amount || '')}`
                                : ''}
                            </span>
                          </div>
                        ) : (
                          ''
                        )}
                        {product?.applied_discount && product?.note_attributes.length > 0 ? (
                          product?.applied_discount?.title == 'voucher_loyalty' &&
                          find(
                            product?.note_attributes,
                            (i: any) => i.name == 'voucher_loyalty_id',
                          ) ? (
                            <div className="d-flex discount-all">
                              <span>Price discounted</span>
                              <span>
                                {product?.applied_discount?.amount
                                  ? `- ${moneyFormater(
                                      product?.applied_discount?.amount || '',
                                    )}`
                                  : ''}
                              </span>
                            </div>
                          ) : (
                            ''
                          )
                        ) : (
                          ''
                        )}
                        <div className="d-flex">
                          <span>
                            {product?.tax_lines && product.tax_lines.length > 0
                              ? `${product?.tax_lines[0]?.title}(+${
                                  product?.tax_lines[0]?.rate * 100
                                }%)`
                              : ''}
                          </span>
                          <span>
                            {product?.total_tax && product?.total_tax != '0.00'
                              ? moneyFormater(product?.total_tax)
                              : ''}
                          </span>
                        </div>
                        <div className="d-flex">
                          <span>Shipping price**</span>
                          <span>
                            {product?.shipping_line &&
                            parseInt(product?.shipping_line?.price) > 0 ? (
                              <span>{moneyFormater(product?.shipping_line?.price)}</span>
                            ) : parseInt(product?.shipping_line?.price) === 0 ? (
                              <span className="free-shipping">FREE</span>
                            ) : (
                              <span className="free-shipping">-</span>
                            )}
                          </span>
                        </div>
                        {_.find(
                          product?.note_attributes,
                          (i) =>
                            i.name == 'discount_code_type' &&
                            i.value == 'discount_free_shipping',
                        ) ? (
                          <div className="d-flex">
                            <span>Shipping Discount Subtotal</span>
                            <span className="text-danger">
                              -{' '}
                              {moneyFormater(
                                _.find(
                                  product?.note_attributes,
                                  (i) => i.name == 'discount_value',
                                )?.value,
                              )}
                            </span>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="total">
                        <span>TOTAL </span>
                        <hr></hr>
                        <h3>
                          {product?.total_price ? moneyFormater(product?.total_price) : ''}
                        </h3>
                      </div>
                      <div className="terms-cond">
                        <label className="checkbox-button" htmlFor="terms-cond">
                          <input
                            type="checkbox"
                            className="checkbox-button__input"
                            id="terms-cond"
                            name="terms-cond"
                            onChange={onAgree}
                            checked={termsAgreed}
                          />
                          <div className="checkbox-button__control"></div>
                        </label>

                        <label className="checkbox-button__label" htmlFor="terms-cond">
                          I agree to the&nbsp;
                          <Link to="/about-us/terms-conditions" target="_blank">
                            Terms and conditions
                          </Link>
                          ,{' '}
                          <Link to="/customer-service/refund-policy" target="_blank">
                            Refund Policy
                          </Link>
                          &nbsp;and&nbsp;
                          <Link to="/about-us/privacy-policy" target="_blank">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      <button
                        className="checkout-button"
                        style={{ cursor: loadingPlaceOrder ? 'not-allowed' : '' }}
                        onClick={() => handleClickPlaceOrder()}
                        disabled={!termsAgreed}
                      >
                        Place Order
                      </button>
                      {loadingPlaceOrder ? (
                        <div
                          className="lds-roller"
                          style={{ transform: 'scale(0.5)', bottom: '27px' }}
                        >
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      ) : (
                        ''
                      )}
                      <div className="cart-note">
                        **FREE shipping for order {'>'} ৳5,000 (VAT excluded)
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer data={dataFooter} />
    </div>
  );
}

export default memo(CheckoutPage);
