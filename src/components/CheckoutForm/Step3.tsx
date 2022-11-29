import React, { useEffect, useState } from 'react';
import { useSelector, RootStateOrAny } from 'react-redux';
import codIC from '../../images/icons/cash-on-pickup.svg';
import masterCardIC from '../../images/icons/master-card.svg';
import visaCardIC from '../../images/icons/visa-card.svg';
import Bkash from '../../images/icons/Bkash.png';
import AdaptiveInput from './AdaptiveInput';
import SSLCommerzVerify from '../SSLCommerzVerify';
function Step3(props: any) {
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(true);
  const productState = useSelector((state: RootStateOrAny) => state.productReducer);

  useEffect(() => {
    if (props.data.payment !== 'cod') setIsCashOnDelivery(false);
  }, []);

  return (
    <section className="form-step form-step-3">
      <h2 className="title-form">
        <span>3</span>
        CHOOSE PAYMENT OPTION
      </h2>
      <p style={{ margin: '32px 0 8px 0', textAlign: 'justify', lineHeight: '1.5rem' }}>
        Sundora Beauty payment gateway is PCI-DSS certified. PCI DSS stands for Payment Card
        Industry Data Security Standard, which sets the requirements for organizations and
        sellers to safely and securely accept, store, process, and transmit cardholder data
        during credit card transaction to prevent fraud and data breaches.
      </p>
      <div className="form-group">
        {!props?.loading?.confirmAddress ? (
          <>
            <label className="radio-custom">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={props.data.payment == 'cod'}
                onChange={props.handleChange}
                disabled={
                  props?.placeOrderForm?.address_id && !productState?.product?.cash_on_delivery
                }
              />
              <span
                className={`radio-label payment-ic ${isCashOnDelivery ? 'checked-input' : ''}`}
              >
                <div className="ic-group">
                  <img
                    className={
                      props?.placeOrderForm?.address_id &&
                      !productState?.product?.cash_on_delivery
                        ? 'disabled'
                        : ''
                    }
                    src={codIC}
                    alt="cod"
                  />
                  <p>
                    {props?.placeOrderForm?.store_location_id
                      ? 'Cash on pickup'
                      : 'Cash on delivery*'}
                  </p>
                </div>
              </span>
            </label>
            <label className="radio-custom">
              <input
                type="radio"
                name="payment"
                value="mastercard"
                checked={props.data.payment == 'mastercard'}
                onChange={props.handleChange}
              />

              <span
                className={`radio-label payment-ic ${
                  props.data.payment == 'mastercard' ? 'checked-input' : ''
                }`}
              >
                <div className="ic-group">
                  <img src={masterCardIC} alt="master-card" />
                  <p>MasterCard</p>
                </div>
              </span>
              <div className="ssllogo">
                <SSLCommerzVerify />
              </div>
            </label>
            <label className="radio-custom">
              <input
                type="radio"
                name="payment"
                value="visacard"
                checked={props.data.payment == 'visacard'}
                onChange={props.handleChange}
              />
              <span
                className={`radio-label payment-ic ${
                  props.data.payment == 'visacard' ? 'checked-input' : ''
                }`}
              >
                <div className="ic-group">
                  <img src={visaCardIC} alt="visa" />
                  <p>Visa</p>
                </div>
              </span>
              <div className="ssllogo">
                <SSLCommerzVerify />
              </div>
            </label>
            <label className="radio-custom">
              <input
                type="radio"
                name="payment"
                value="mobilebank"
                checked={props.data.payment == 'mobilebank'}
                onChange={props.handleChange}
                disabled
              />
              <span
                className={`radio-label payment-ic ${
                  props.data.payment == 'visacard' ? 'checked-input' : ''
                }`}
              >
                <div className="ic-group">
                  <img
                    className="disabled"
                    src={Bkash}
                    alt="mobile-card"
                    style={{ padding: 6 }}
                  />
                  <p>Bkash</p>
                </div>
              </span>
              <div className="ssllogo comming-soon">Coming soon ...</div>
            </label>
          </>
        ) : (
          <div
            style={{
              padding: '3.5vw 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'translate(-5%, 0%)',
            }}
          >
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
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          <AdaptiveInput
            type="text"
            for="company_name"
            name="company_name"
            label="Company name (optional)"
            value={props.data.company_name}
            handleChange={props.handleChange}
          />
          <div className="cart-note">
            *Cash on delivery unavailable for order {'>'} ৳25,000
          </div>
        </div>
      </div>
    </section>
  );
}
export default Step3;
