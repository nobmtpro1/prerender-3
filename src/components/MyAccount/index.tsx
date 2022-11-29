import React, { createRef, useEffect, useState } from 'react';
// import Select from 'react-dropdown-select';
import { useDispatch } from 'react-redux';
import {
  fetchClient,
  formatPhoneNumber,
  toastrSuccess,
  validateEmail,
  validatePhone,
} from '../../redux/Helpers';
import Map from '../Map';
import { GET_USER_INFO, PUT_USER_INFO } from '../../config';
import AdaptiveInput from '../CheckoutForm/AdaptiveInput';
import * as action from '../../redux/auth/actions';
import { replace } from 'lodash';

function MyAccount(props: any) {
  const dispatch = useDispatch();
  const firstNameRef = createRef<any>();
  const lastNameRef = createRef<any>();
  const [addressForm, setAddressForm] = useState<any>({
    addressInfo: null,
    isBillingAddress: true,
    billingInfo: '',
  });
  const [validateForm, setValidateForm] = useState<any>({
    first_name_last_name: '',
    password: '',
    email: '',
    phone: '',
  });
  const [userInfo, setUserInfo] = useState<any>({
    first_name: null,
    last_name: null,
    password: '',
    confirm_password: '',
    email: null,
    phone: null,
  });
  // const [billing, setBilling] = useState<any>([
  //   {
  //     value: 'lorem',
  //     title: 'Lorem',
  //   },
  // ]);
  // const handleSelectBilling = (value: any) => {
  //   setBilling(value);
  // };
  const fetchDataInfoUser = () => {
    if (localStorage.getItem('sundoraToken')) {
      const options = {
        url: GET_USER_INFO,
        method: 'GET',
        body: null,
      };
      fetchClient(options).then((res) => {
        if (res.success) {
          if (res.data.phone) {
            const phone = res.data.phone;
            res.data.phone = phone.slice(phone.indexOf('0'), phone.length);
          }
          const userData = res.data;
          if (userData.guest) {
            if (userData?.note?.guest?.email) {
              userData.email = userData?.note?.guest?.email;
            }
            if (userData?.note?.guest?.phone) {
              userData.phone = replace(userData?.note?.guest?.phone, '+88', '');
            }
          }
          setUserInfo(userData);
        }
      });
    }
  };
  useEffect(() => {
    if (localStorage.getItem('sundoraToken')) {
      dispatch(action.getAddressActions('shipping'));
      dispatch(action.getAddressActions('billing'));
    }
    fetchDataInfoUser();
  }, []);

  // const billingOptions = [
  //   {
  //     value: 'lorem',
  //     title: 'Lorem',
  //   },
  //   {
  //     value: 'ipsum-dolor',
  //     title: 'Ipsum dolor',
  //   },
  //   {
  //     value: 'sis-amet',
  //     title: 'Sis amet',
  //   },
  // ];
  const confirmAddressStep = (value: any) => {
    setAddressForm({ ...addressForm, addressInfo: value, isShowStep2: false });
  };
  const onChange = (event: any) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };
  const onChangeBilling = (event: any) => {
    setAddressForm({ ...addressForm, [event.target.name]: event.target.checked });
  };
  // const onChangeBillingInfo = (event: any) => {
  //   setAddressForm({ ...addressForm, [event.target.name]: event.target.value });
  // };

  const checkValidUsernameLastName = () => {
    const wordCountFirstname =
      userInfo.first_name && userInfo?.first_name.trim().replace(/\s+/g, ' ').length > 0
        ? userInfo.first_name.trim().replace(/\s+/g, ' ').length
        : 0;
    const wordCountLastname =
      userInfo.last_name && userInfo?.last_name.trim().replace(/\s+/g, ' ').length > 0
        ? userInfo.last_name.trim().replace(/\s+/g, ' ').length
        : 0;

    if (wordCountFirstname === 0 && wordCountLastname === 0) {
      firstNameRef.current.focus();
      firstNameRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return 'Please enter first name and last name!';
    }

    if (wordCountFirstname === 0) {
      firstNameRef.current.focus();
      firstNameRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return 'Please enter first name!';
    }

    if (wordCountLastname === 0) {
      lastNameRef.current.focus();
      lastNameRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return 'Please enter last name!';
    }
  };
  const checkValidPassword = () => {
    if (
      (userInfo.password || userInfo.confirm_password) &&
      userInfo.password != userInfo.confirm_password
    ) {
      return `Password confirmation doesn't match password`;
    }
  };
  const checkValidEmail = () => {
    if (!userInfo.email) {
      return 'Please enter email';
    }
    const validEmail = validateEmail(userInfo.email.trim());

    if (validEmail == false) {
      return `Please enter valid email`;
    }
  };

  const checkValidPhone = () => {
    if (!userInfo.phone || userInfo?.phone == '') {
      return 'Please enter phone number';
    }
    const phone = formatPhoneNumber(userInfo.phone);

    const validPhone = validatePhone(phone);

    if (validPhone == false) {
      return `Please enter valid phone number`;
    }
  };
  const checkValidForm = () => {
    const validName = checkValidUsernameLastName();
    const validPassword = checkValidPassword();
    const validEmail = checkValidEmail();
    const validPhone = checkValidPhone();
    checkValidEmail();
    setValidateForm({
      ...validateForm,
      ...{
        user_name_last_name: validName,
        password: validPassword,
        email: validEmail,
        phone: validPhone,
      },
    });
    if (validName || validPassword || validEmail || validPhone) {
      return true;
    } else {
      return false;
    }
  };
  const handleSubmitChangeUserInfo = () => {
    const valid = checkValidForm();
    if (!valid) {
      const options = {
        url: PUT_USER_INFO,
        method: 'PUT',
        body: {
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          password: userInfo.password ? userInfo.password.trim() : '',
          email: userInfo.email || '',
          phone: userInfo.phone ? formatPhoneNumber(userInfo.phone.trim()) : '',
          confirm_password: userInfo.confirm_password ? userInfo.confirm_password.trim() : '',
        },
      };
      fetchClient(options).then((res) => {
        if (res.success) {
          fetchDataInfoUser();
          toastrSuccess('Update info successfully');
        } else if (res.isError) {
        }
      });
    }
  };
  return (
    <section className="tab-MyAccount">
      <h1>My Account {userInfo?.guest ? <span className="text-guest">(guest)</span> : ''}</h1>
      {/* <form action=""> */}
      <div
        className="row"
        style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #ddd' }}
      >
        <div className="col-md-2 col-12">
          <h3>Account</h3>
        </div>
        <div className="col-lg-6 col-md-10 col-12">
          <div className="form-group">
            {/* <AdaptiveInput
              type="text"
              for="username"
              label="User name"
              value={userInfo?.username}
              readOnly={true}
            /> */}
            <div className="row">
              <div className="col-6">
                <AdaptiveInput
                  type="text"
                  for="First name"
                  label="First name"
                  name="first_name"
                  value={userInfo?.first_name}
                  handleChange={onChange}
                  refName={firstNameRef}
                  // validate={validateForm.user_name ? true : false}
                  // validateContent={validateForm.user_name}
                />
              </div>
              <div className="col-6">
                <AdaptiveInput
                  type="text"
                  for="Last name"
                  label="Last name"
                  name="last_name"
                  value={userInfo?.last_name}
                  handleChange={onChange}
                  validate={validateForm.user_name_last_name ? true : false}
                  validateContent={validateForm.user_name_last_name}
                  refName={lastNameRef}
                />
              </div>
            </div>
            <div className="row p-0">
              <div className="col-6 off-animation-text">
                <AdaptiveInput
                  type="text"
                  for="Birthday"
                  label="Birthday"
                  name=""
                  readOnly={true}
                  value={userInfo?.note?.birthday ?? ''}
                />
              </div>
              <div className="col-6">
                <AdaptiveInput
                  type="text"
                  for="gender"
                  label="Gender"
                  name=""
                  readOnly={true}
                  value={userInfo?.note?.gender ?? ''}
                />
              </div>
            </div>
            <AdaptiveInput
              type="text"
              for="Email address"
              label="Email address"
              name="email"
              value={userInfo?.email || ''}
              validate={validateForm.email ? true : false}
              validateContent={validateForm.email}
              handleChange={onChange}
            />
            <div className="phone-input">
              <AdaptiveInput
                type="text"
                for="Phone number"
                label="Phone number"
                name="phone"
                value={userInfo?.phone || ''}
                validate={validateForm.phone ? true : false}
                validateContent={validateForm.phone}
                handleChange={onChange}
              />
            </div>
            {!userInfo?.guest ? (
              <div className="row">
                <div className="col-6">
                  <AdaptiveInput
                    type="password"
                    for="Password"
                    label="Password"
                    name="password"
                    value={userInfo?.password || ''}
                    handleChange={onChange}
                  />
                </div>
                <div className="col-6">
                  <AdaptiveInput
                    type="password"
                    for="Confirm password"
                    label="Confirm password"
                    name="confirm_password"
                    value={userInfo?.confirm_password || ''}
                    validate={true}
                    handleChange={onChange}
                    validateContent={validateForm.password}
                    // validateContent="Password must be at least 8 character lorem dolor sit amet consectetur"
                  />
                </div>
              </div>
            ) : (
              ''
            )}
            <div className="row">
              <button className="btn-change-password" onClick={handleSubmitChangeUserInfo}>
                Change
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-1 col-12"></div>
      </div>
      <div
        className="row"
        style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #ddd' }}
      >
        <div className="col-md-2 col-12">
          <h3>Address</h3>
        </div>
        <div className="col-lg-6 col-md-10 col-12">
          <div className="form-group">
            <Map
              google={props.google}
              center={{ lat: 18.5204, lng: 73.8567 }}
              height="300px"
              zoom={15}
              confirmAddressStep={confirmAddressStep}
              isAllowDelete={true}
              type="shipping"
            />
            <label className="checkbox-button">
              <input
                type="checkbox"
                className="checkbox-button__input"
                id="choice1-1"
                name="isBillingAddress"
                checked={addressForm.isBillingAddress}
                onChange={onChangeBilling}
              />
              <span className="checkbox-button__control"></span>
              <span className="checkbox-button__label">
                Yes, make this to my billing address
              </span>
            </label>
            {/* <AdaptiveInput
              type="textarea"
              for="billingInfo"
              name="billingInfo"
              value={addressForm?.billingInfo}
              handleChange={onChangeBillingInfo}
            /> */}
          </div>
          {/* <div className="form-group">
            <div className="row">
              <div className="col-8">
                <AdaptiveInput type="text" for="Street" label="Street" />
              </div>
              <div className="col-4">
                <AdaptiveInput type="number" for="Number" label="Number" />
              </div>
            </div>
            <AdaptiveInput type="text" for="Street #2" label="Full name" />
            <div className="row">
              <div className="col-6">
                <AdaptiveInput type="text" for="Lorem" label="Lorem" />
              </div>
              <div className="col-6">
                <AdaptiveInput type="text" for="City" label="City" />
              </div>
            </div>
          </div> */}
        </div>
        <div className="col-md-4 col-12"></div>
      </div>
      {!addressForm?.isBillingAddress ? (
        <div className="row" style={{ marginBottom: 24, marginTop: 32 }}>
          <div className="col-md-2 col-12">
            <h3>Billing</h3>
          </div>
          <div className="col-lg-6 col-md-10 col-12">
            <div className="form-group">
              <Map
                google={props.google}
                center={{ lat: 18.5204, lng: 73.8567 }}
                height="300px"
                zoom={15}
                confirmAddressStep={confirmAddressStep}
                isAllowDelete={true}
                type="billing"
              />
            </div>
            {/* <div className="form-group">
            <div className="row">
              <div className="col-8">
                <AdaptiveInput type="text" for="Street" label="Street" />
              </div>
              <div className="col-4">
                <AdaptiveInput type="number" for="Number" label="Number" />
              </div>
            </div>
            <AdaptiveInput type="text" for="Street #2" label="Full name" />
            <div className="row">
              <div className="col-6">
                <AdaptiveInput type="text" for="Lorem" label="Lorem" />
              </div>
              <div className="col-6">
                <AdaptiveInput type="text" for="City" label="City" />
              </div>
            </div>
          </div> */}
          </div>
          <div className="col-md-4 col-12"></div>
        </div>
      ) : (
        ''
      )}

      {/* </form> */}
    </section>
  );
}

export default MyAccount;
