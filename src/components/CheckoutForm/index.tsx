import React, { memo, useEffect, useState } from 'react';
import Step1 from './Step1';
import Step3 from './Step3';
import Step2 from './Step2';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import * as action from '../../redux/auth/actions';
import * as actionsProduct from '../../redux/product/actions';
import { GET_USER_INFO } from '../../config';
import { fetchClient, formatPhoneNumber } from '../../redux/Helpers';
import { toLower, trim } from 'lodash';

function CheckoutForm(props: any): JSX.Element {
  const dispatch = useDispatch();
  const placeOrderForm = useSelector(
    (state: RootStateOrAny) => state.productReducer.placeOrderForm,
  );
  const [loading, setLoading] = useState<any>({
    register: false,
    continueAsGuest: false,
    confirmAddress: false,
  });
  const [userInfo, setUserInfo] = useState<any>({
    first_name: null,
    last_name: null,
    password: '',
    confirm_password: '',
    email: null,
    phone: null,
  });
  const [checkoutForm, setCheckoutForm] = useState<any>({
    currentStep: 1, // Default is Step 1
    isShowStep2: true,
    email: '',
    phone: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    deliveryType: 'store',
    payment: 1,
    addressInfo: null,
    company_name: '',
  });
  const [addressStore, setAddressStore] = useState<any>([]);

  const resetForm = () => {
    setCheckoutForm({
      currentStep: 1, // Default is Step 1
      isShowStep2: true,
      email: '',
      phone: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      birthday: '',
      gender: '',
      deliveryType: 'store',
      payment: 1,
      addressInfo: null,
      company_name: '',
    });
  };

  const handleChange = (event: any) => {
    const name = event.currentTarget.name;
    const value = event.target.value;

    setCheckoutForm({ ...checkoutForm, [name]: value });
    if (event.currentTarget.name == 'payment') {
      dispatch(
        actionsProduct.setMultiCardNamePlaceOrderForm({
          multi_card_name: event.target.value,
        }),
      );
    }
    if (event.currentTarget.name == 'company_name') {
      dispatch(
        actionsProduct.setMultiCardNamePlaceOrderForm({
          company_name: event.target.value,
        }),
      );
    }
  };

  const handleEmailPhoneChange = (email: string, phone: string) => {
    setCheckoutForm((prev: any) => ({ ...prev, email, phone }));
  };

  const handleLoading = (data: any) => {
    setLoading({ ...loading, [data.key]: data.value });
  };

  const handleLogin = (event: any) => {
    event.preventDefault();
    const draft_order_id = localStorage.getItem('id_checkout')
      ? localStorage.getItem('id_checkout')
      : null;
    dispatch(
      action.loginActions({
        email: (checkoutForm.email as string).toLowerCase(),
        password: checkoutForm.password,
        draft_order_id: draft_order_id,
      }),
    );
  };

  const handleRegister = (event: any) => {
    event.preventDefault();
    const draft_order_id = localStorage.getItem('id_checkout');
    handleLoading({ key: 'register', value: true });
    dispatch(
      action.registerActions({
        customer: {
          email: checkoutForm.email ? (checkoutForm.email as string).toLowerCase() : null,
          phone: formatPhoneNumber(checkoutForm.phone),
          first_name: checkoutForm.firstName,
          last_name: checkoutForm.lastName,
          password: checkoutForm.password,
          password_confirmation: checkoutForm.password,
          draft_order_id: draft_order_id,
          note: {
            birthday: checkoutForm.birthday,
            gender: checkoutForm.gender,
          },
          withTimeout: true,
        },
      }),
    );
  };

  const handleRegisterGuest = (event: any) => {
    event.preventDefault();
    handleLoading({ key: 'continueAsGuest', value: true });
    const draft_order_id = localStorage.getItem('id_checkout');
    dispatch(
      action.registerGuestActions({
        customer: {
          email: checkoutForm.email ? (checkoutForm.email as string).toLowerCase() : null,
          phone: formatPhoneNumber(checkoutForm.phone),
          first_name: checkoutForm.firstName,
          last_name: checkoutForm.lastName,
          password: checkoutForm.password,
          password_confirmation: checkoutForm.password,
          draft_order_id: draft_order_id,
          note: {
            birthday: checkoutForm.birthday,
            gender: checkoutForm.gender,
          },
          guest: true,
        },
      }),
    );
  };

  const handleChangeSelect = (keyName: any, value: any) => {
    setCheckoutForm({
      ...checkoutForm,
      [keyName]: trim(toLower(value[0].name)),
    });
  };

  const fetchDataInfoUser = () => {
    if (localStorage.getItem('sundoraToken')) {
      const options = {
        url: GET_USER_INFO,
        method: 'GET',
        body: null,
      };
      fetchClient(options).then((res) => {
        if (res.success) {
          setUserInfo(res.data);
        }
      });
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  const confirmAddressStep = (value: any) => {
    setCheckoutForm({
      ...checkoutForm,
      addressInfo: value,
      isShowStep2: false,
    });
  };

  const confirmAddressBillingStep = (value: any) => {
    setCheckoutForm({
      ...checkoutForm,
      addressBillingInfo: value,
      isShowStep2: true,
    });
  };

  const handleSelectAddress = (value: any) => {
    props.handleDeleteDiscountAndShippingAddress();
    setAddressStore(value);
    dispatch(
      actionsProduct.setPlaceOrderForm({
        ...placeOrderForm,
        address_id: null,
        store_location_id:
          checkoutForm.deliveryType == 'store' && value[0].id ? value[0].id : null,
        multi_card_name: props?.placeOrderForm?.multi_card_name,
      }),
    );
    setCheckoutForm({
      ...checkoutForm,
      isShowStep2: false,
    });
  };

  const toogleShowStep2 = () => {
    setCheckoutForm({ ...checkoutForm, isShowStep2: !checkoutForm.isShowStep2 });
  };
  useEffect(() => {
    fetchDataInfoUser();
  }, []);
  return (
    <section className="checkout-form">
      <form onSubmit={handleSubmit}>
        <Step1
          currentStep={checkoutForm.currentStep}
          handleChange={handleChange}
          data={checkoutForm}
          userInfo={userInfo}
          loading={loading}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          handleRegisterGuest={handleRegisterGuest}
          handleChangeSelect={handleChangeSelect}
          handleEmailPhoneChange={handleEmailPhoneChange}
          resetForm={resetForm}
        />
      </form>
      <Step2
        handleChange={handleChange}
        currentStep={checkoutForm.currentStep}
        data={checkoutForm}
        confirmAddressStep={confirmAddressStep}
        toogleShowStep2={toogleShowStep2}
        addressStore={addressStore}
        handleSelectAddress={handleSelectAddress}
        confirmAddressBillingStep={confirmAddressBillingStep}
        setLoading={setLoading}
        setCheckoutForm={setCheckoutForm}
      />
      <Step3
        handleChange={handleChange}
        currentStep={checkoutForm.currentStep}
        data={checkoutForm}
        placeOrderForm={props.placeOrderForm}
        loading={loading}
      />
    </section>
  );
}
export default memo(CheckoutForm);
