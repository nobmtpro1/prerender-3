import React, { useEffect, useState } from 'react';
import './styles.scss';
import { Link, useParams } from 'react-router-dom';
import successfulPayment from '../../images/icons/successful-payment.svg';
import cancelPayment from '../../images/icons/cancel-payment.svg';
import { useDispatch } from 'react-redux';
import { setLineItems } from '../../redux/product/actions';
import { fetchClient } from '../../redux/Helpers';
import { GET_ORDER_HISTORY, PUT_PLACE_ORDER_CHECKOUT } from '../../config';
import { purchaseCheckout } from '../../utils/helpers/productTracker';

function PaymentSuccessPage(): JSX.Element {
  const [statusChecked, setStatusChecked] = useState<any>(null);
  const [verify, setVerify] = useState<any>(false);
  const dispatch = useDispatch();
  const { status, id } = useParams<any>();
  useEffect(() => {
    const options = {
      url: `${PUT_PLACE_ORDER_CHECKOUT}${id}/success/verify/`,
      method: 'POST',
      body: null,
    };

    if (status == 'success') {
      fetchClient(options)
        .then((res) => {
          if (res.success) {
            const optionsOrder = {
              url: `${GET_ORDER_HISTORY}${res?.data?.order_uuid}`,
              method: 'GET',
              body: null,
            };

            // Set status
            setStatusChecked(true);
            setVerify(true);

            // Ecommerce google analytic
            fetchClient(optionsOrder).then((res) => {
              const { data } = res;
              // console.log(res);
              purchaseCheckout(data);
            });

            if (res?.data?.user?.guest) {
              localStorage.removeItem('sundoraToken');
            }

            localStorage.removeItem('id_checkout');

            dispatch(setLineItems([]));
          } else if (res.isError) {
            setStatusChecked(true);
            setVerify(false);
          }
        })
        .catch(() => setVerify(false));
    } else {
      setStatusChecked(true);
      setVerify(true);
    }
  }, []);
  return (
    <section className="section-PaymentSuccessPage">
      {!statusChecked ? (
        <section className="verify">
          <h4>Searching for verify payment</h4>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </section>
      ) : status == 'success' && verify ? (
        <div className="status-box done">
          <img src={successfulPayment} alt="" />
          <h3>THANK YOU!</h3>
          <h4>Your payment was successful</h4>
          <Link to="/">Continue shopping</Link>
        </div>
      ) : status == 'cancel' ? (
        <div className="status-box done">
          <img src={cancelPayment} alt="" />
          <h4>Your payment was cancelled</h4>
          <Link to="/checkout">Back to checkout</Link>
        </div>
      ) : status == 'failed' ? (
        <div className="status-box done">
          <img src={cancelPayment} alt="" />
          <h3>OOP!</h3>
          <h4>Your payment was failed. Please try again</h4>
          <Link to="/checkout">Back to checkout</Link>
        </div>
      ) : (
        ''
      )}
      {statusChecked && !verify ? (
        <div className="status-box done">
          <img src={cancelPayment} alt="" />
          <h4>VERIFICATION FAILED</h4>
          <h4>Your id payment is incorrect. Please try again</h4>
          <Link to="/checkout">Back to checkout</Link>
        </div>
      ) : (
        ''
      )}
    </section>
  );
}
export default PaymentSuccessPage;
