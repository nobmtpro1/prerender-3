import React, { useEffect, useState } from 'react';
import './styles.scss';
import { Link, useParams } from 'react-router-dom';
import successfulPayment from '../../images/icons/successful-payment.svg';
import cancelPayment from '../../images/icons/cancel-payment.svg';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/product/actions';
import { fetchClient } from '../../redux/Helpers';
import { GET_ORDER_HISTORY, PUT_PLACE_ORDER_CHECKOUT } from '../../config';
import { purchaseCheckout } from '../../utils/helpers/productTracker';

function OrderCODVerifyPage(): JSX.Element {
  const [statusChecked, setStatusChecked] = useState<any>(null);
  const [verify, setVerify] = useState<any>(false);
  const [guest, setGuest] = useState<boolean>(false);
  const [textSuccess, setTextSuccess] = useState<any>('Orders pay on delivery');
  const dispatch = useDispatch();
  const { status, id } = useParams<any>();
  useEffect(() => {
    const options = {
      url: `${PUT_PLACE_ORDER_CHECKOUT}${id}/order_verify/`,
      method: 'POST',
      body: null,
    };
    if (status == 'success') {
      const guestUser = !!localStorage.getItem('sundora_guest_id');
      if (guestUser) setGuest(true);
      fetchClient(options)
        .then((res) => {
          if (res.success) {
            const optionsOrder = {
              url: `${GET_ORDER_HISTORY}${res?.data?.order?.uuid}/`,
              method: 'GET',
              body: null,
            };

            // Set text
            if (!res?.data?.order?.shipping) {
              setTextSuccess('Cash on pickup');
            }

            // Set status
            setStatusChecked(true);
            setVerify(true);

            // Ecommerce google analytic
            fetchClient(optionsOrder).then((res) => {
              const { data } = res;
              purchaseCheckout(data);
            });

            if (res?.data?.user?.guest) {
              localStorage.removeItem('sundoraToken');
            }

            localStorage.removeItem('id_checkout');
            if (guestUser) localStorage.removeItem('sundora_guest_id');

            dispatch(clearCart());
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
          <h4>Searching for verify order</h4>
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
          <h4>{textSuccess}</h4>
          {guest ? (
            <Link to="/">Back to home</Link>
          ) : (
            <Link to="/account/order-history">View orders</Link>
          )}
        </div>
      ) : status == 'cancel' ? (
        <div className="status-box done">
          <img src={cancelPayment} alt="" />
          <h4>Your order cancelled</h4>
          <Link to="/checkout">Back to checkout</Link>
        </div>
      ) : status == 'failed' ? (
        <div className="status-box done">
          <img src={cancelPayment} alt="" />
          <h3>OOP!</h3>
          <h4>Your order was failed. Please try again</h4>
          <Link to="/checkout">Back to checkout</Link>
        </div>
      ) : (
        ''
      )}
      {statusChecked && !verify ? (
        <div className="status-box done">
          <img src={cancelPayment} alt="" />
          <h4>VERIFICATION FAILED</h4>
          <h4>Your order is incorrect. Please try again</h4>
          <Link to="/checkout">Back to checkout</Link>
        </div>
      ) : (
        ''
      )}
    </section>
  );
}
export default OrderCODVerifyPage;
