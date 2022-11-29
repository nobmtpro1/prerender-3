import React, { memo, useEffect, useState } from 'react';
import { GET_LOCATION } from '../../config';
import { fetchClient } from '../../redux/Helpers';
import Map from '../Map';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import * as action from '../../redux/auth/actions';
import { isMobile } from '../../DetectScreen';
import * as actionsProduct from '../../redux/product/actions';

function Step2(props: any) {
  const [isBillingAddress, setIsBillingAddress] = useState<any>(true);
  const placeOrderForm = useSelector(
    (state: RootStateOrAny) => state.productReducer.placeOrderForm,
  );
  const dispatch = useDispatch();

  const productReduceer = useSelector((state: RootStateOrAny) => state.productReducer);
  const selectedAddressId = productReduceer?.placeOrderForm?.address_id || null;
  const selectedAddressBillingId = productReduceer?.placeOrderForm?.address_billing_id || null;

  useEffect(() => {
    const options = {
      url: `${GET_LOCATION}`,
      method: 'GET',
      body: null,
    };
    fetchClient(options)
      .then()
      .catch((err) => console.log(err));
    if (localStorage.getItem('sundoraToken')) {
      dispatch(action.getAddressActions('billing'));
    }
  }, []);

  const onChangeBilling = (event: any) => {
    setIsBillingAddress(event.target.checked);
  };

  useEffect(() => {
    props?.setLoading((prev: any) => ({ ...prev, confirmAddress: false }));
    dispatch(
      actionsProduct.setMultiCardNamePlaceOrderForm({
        multi_card_name: '',
      }),
    );
    props?.setCheckoutForm((prev: any) => ({ ...prev, payment: '' }));
  }, [productReduceer?.placeOrderForm?.address_id]);

  return (
    <section className="form-step form-step-2">
      <h2
        className={`title-form title-step-2 ${
          placeOrderForm?.address_id || placeOrderForm?.store_location_id ? 'step-done' : ''
        }`}
        onClick={props.toogleShowStep2}
      >
        <span>
          {placeOrderForm?.address_id || placeOrderForm?.store_location_id ? (
            <i className="gg-check"></i>
          ) : (
            2
          )}
        </span>
        CHOOSE DELIVERY ADDRESS
      </h2>
      <div style={{ display: props.data.isShowStep2 ? '' : 'none' }}>
        <p
          style={{
            margin: !isMobile ? '32px 0 8px 0' : '24px 0 8px 0',
            textAlign: 'justify',
            lineHeight: '1.5rem',
          }}
        ></p>
        <>
          <Map
            google={props.google}
            center={{ lat: 18.5204, lng: 73.8567 }}
            height="300px"
            zoom={15}
            confirmAddressStep={props.confirmAddressStep}
            type="shipping"
            isCheckoutForm={true}
            fromCheckOut={true}
            selectedAddressId={selectedAddressId}
            setLoading={props?.setLoading}
            setCheckoutForm={props?.setCheckoutForm}
          />
          <label className="checkbox-button">
            <input
              type="checkbox"
              className="checkbox-button__input"
              id="choice1-1"
              name="isBillingAddress"
              checked={isBillingAddress}
              onChange={onChangeBilling}
            />
            <span className="checkbox-button__control"></span>
            <span className="checkbox-button__label">
              Yes, make this to my billing address
            </span>
          </label>

          <div className="form-group">
            <label className="radio-custom">
              <input
                id="store"
                type="radio"
                name="deliveryType"
                value="delivery"
                checked={true}
                onChange={props.handleChange}
              />
              <span className="radio-label">Standard delivery</span>
            </label>
          </div>

          {!isBillingAddress ? (
            <div className="row" style={{ marginBottom: 24, marginTop: 32 }}>
              <div className="col-12">
                <h3>Billing</h3>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <Map
                    google={props.google}
                    center={{ lat: 18.5204, lng: 73.8567 }}
                    height="300px"
                    zoom={15}
                    confirmAddressStep={props.confirmAddressBillingStep}
                    type="billing"
                    fromCheckOut={true}
                    setLoading={props?.setLoading}
                    setCheckoutForm={props?.setCheckoutForm}
                    selectedAddressId={selectedAddressBillingId}
                  />
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </>
      </div>
    </section>
  );
}
export default memo(Step2);
