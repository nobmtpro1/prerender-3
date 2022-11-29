import React, { useEffect, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import BlockModal from '../BlockModal';
import * as action from '../../redux/auth/actions';
import './login-modal.scss';
import {
  fetchClient,
  formatPhoneNumber,
  validateEmail,
  validatePhone,
} from '../../redux/Helpers';
import { GET_SOCIAL_MEDIA_CLIENT_IDS, POST_CHECK_VALID_EMAIL } from '../../config';
import { Link, useHistory } from 'react-router-dom';
import AdaptiveInput from '../CheckoutForm/AdaptiveInput';
import cookies from '../../redux/Helpers/cookies';
import { isMobile } from '../../DetectScreen';
import Select from 'react-dropdown-select';
import { toLower, trim } from 'lodash';
import DotLoader from '../DotLoader';
import SMSVerify from './SMSVerify';

function LoginModal(): JSX.Element {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState('');
  const [dataForm, setDataForm] = useState<any>({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    phone: '',
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    newsletter_email: true,
    newsletter_sms: true,
  });
  const stateUser = useSelector((state: RootStateOrAny) => state.userReducer);
  const [validEmail, setValidEmail] = useState<any>(true);
  const [validateForm, setValidateForm] = useState<any>({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    phone: '',
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [openSMSVerify, setOpenSMSVerify] = useState<boolean>(false);

  const islogged = localStorage.getItem('sundoraToken') && cookies.get('token');

  const checkValidEmail = async () => {
    const validCheckEmail = validateEmail(dataForm.email.trim());
    const validCheckPhone = validatePhone(dataForm.email.trim());

    if (!validCheckEmail && validCheckPhone) {
      setDataForm((prev: any) => ({ ...prev, email: '', phone: dataForm.email.trim() }));
    }

    if (!validCheckEmail) {
      return `Please enter valid email`;
    }

    const options = {
      url: POST_CHECK_VALID_EMAIL,
      method: 'POST',
      body: {
        email: (dataForm.email as string).toLowerCase().trim(),
      },
    };

    try {
      const res = await fetchClient(options);
      if (validEmail) {
        setValidEmail(res.success);
      } else if (!validEmail && res.success) {
        return `Please choose another email`;
      }
    } catch (error) {
      // console.log(error);
    }

    if (!validCheckEmail) {
      return `Please enter valid email`;
    }
  };

  const checkValidPassword = () => {
    if (!dataForm.password || dataForm?.password == '') {
      return 'Please enter password';
    }
    const validPassword = dataForm.password.length >= 8;

    if (validPassword == false) {
      return `Please enter a password of more than 8 characters`;
    }
  };

  const checkValidPasswordCofirm = () => {
    if (dataForm?.password != dataForm?.password_confirm) {
      return 'Confirm password is not known correctly';
    }
  };

  const checkValidPhone = async () => {
    if (!dataForm.phone || dataForm?.phone == '') {
      return 'Please enter phone number';
    }
    const phone = formatPhoneNumber(dataForm.phone);
    const validPhone = validatePhone(phone);

    if (validPhone == false) {
      return `Please enter valid phone number`;
    }

    const options = {
      url: POST_CHECK_VALID_EMAIL,
      method: 'POST',
      body: {
        email: phone,
      },
    };
    try {
      const response = await fetchClient(options);
      if (response.success) {
        return `Please choose another phone number`;
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const checkValidFirstName = () => {
    if (!dataForm.firstName || dataForm?.firstName == '') {
      return 'Please enter first name';
    }
  };

  const checkValidLastName = () => {
    if (!dataForm.lastName || dataForm?.lastName == '') {
      return 'Please enter last name';
    }
  };

  const checkValidForm = async () => {
    const validEmail = await checkValidEmail();
    const validPassword = checkValidPassword();
    const validPasswordConfirm = checkValidPasswordCofirm();
    const validFirstName = checkValidFirstName();
    const validLastName = checkValidLastName();
    const validPhone = await checkValidPhone();
    setValidateForm({
      ...validateForm,
      ...{
        email: validEmail,
        password: validPassword,
        password_confirm: validPasswordConfirm,
        firstName: validFirstName,
        lastName: validLastName,
        phone: validPhone,
      },
    });

    if (
      validEmail ||
      validPassword ||
      validPasswordConfirm ||
      validFirstName ||
      validLastName ||
      validPhone
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, isCheckbox = false) => {
    let value: any = event.target.value;
    if (isCheckbox) value = event.target.checked;
    setDataForm({ ...dataForm, [event.currentTarget.name]: value });
  };

  const handleChangeSelect = (keyName: any, value: any) => {
    setDataForm({
      ...dataForm,
      [keyName]: trim(toLower(value[0].name)),
    });
  };

  const handleLogin = (event: any) => {
    event.preventDefault();
    setLoading(true);
    const draft_order_id = localStorage.getItem('id_checkout')
      ? localStorage.getItem('id_checkout')
      : null;
    dispatch(
      action.loginActions({
        email: (dataForm.email as string).toLowerCase(),
        password: dataForm.password,
        draft_order_id: draft_order_id,
      }),
    );
  };

  const handleregister = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    const valid = await checkValidForm();
    if (valid) {
      setLoading(false);
      return false;
    }
    const draft_order_id = localStorage.getItem('id_checkout')
      ? localStorage.getItem('id_checkout')
      : null;
    dispatch(
      action.registerActions({
        customer: {
          email: dataForm.email ? (dataForm.email as string).toLowerCase() : null,
          password: dataForm.password,
          password_confirmation: dataForm.password,
          phone: formatPhoneNumber(dataForm.phone),
          draft_order_id: draft_order_id,
          first_name: dataForm.firstName,
          last_name: dataForm.lastName,
          note: {
            birthday: dataForm.birthday,
            gender: dataForm.gender,
          },
          withTimeout: true,
          newsletter_email: dataForm.newsletter_email,
          newsletter_sms: dataForm.newsletter_sms,
        },
      }),
    );

    setOpenSMSVerify(true);
  };

  const handelToggleModal = () => {
    dispatch(action.toggleModalLoginActions(false));
  };

  const handleKeyPress = () => {
    dispatch(action.toggleModalLoginActions(false));
  };
  const history = useHistory();
  const directForgotPassword = () => {
    dispatch(action.toggleModalLoginActions(false));
    history.push('/forgot-password');
  };

  useEffect(() => {
    const options = {
      url: GET_SOCIAL_MEDIA_CLIENT_IDS,
      method: 'GET',
      body: null,
    };
    fetchClient(options).then((res) => {
      if (res.success) {
      }
    });
  }, []);

  useEffect(() => {
    if (stateUser.loginRequestStatus.error) {
      setLoading(false);
    }
  }, [stateUser.loginRequestStatus.error]);

  const renderLoginError = () => {
    if (
      validEmail &&
      !stateUser.loginRequestStatus.inProgress &&
      stateUser.loginRequestStatus.error
    ) {
      if (stateUser.loginRequestStatus.exists && !stateUser.loginRequestStatus.email_verified)
        return (
          <p className="err-login">
            Email not verified, new magic link has been sent to your email
          </p>
        );
      else if (
        stateUser.loginRequestStatus.exists &&
        !stateUser.loginRequestStatus.sms_verified
      ) {
        setOpenSMSVerify(true);
      } else return <p className="err-login">Wrong username or password</p>;
    }
    return null;
  };

  return (
    <section className="loginModal">
      <BlockModal
        isOpen={stateUser.modalLogin}
        minWidth={isMobile ? '70%' : '36%'}
        maskBg={true}
        onKeyPress={!successMessage?.length ? () => handleKeyPress() : () => null}
        onClickAway={!successMessage?.length ? () => handelToggleModal() : () => null}
        showCloseButton={!successMessage?.length}
      >
        {successMessage?.length ? (
          <div className="register-success">
            <h2>
              Email verification sent! Click on the link sent by email to verify your account
            </h2>
            <p>{successMessage}</p>
          </div>
        ) : null}

        {loading ? '' : ''}

        <div className="wrapper-form">
          {!successMessage?.length && !openSMSVerify ? (
            <h2 className={`title-form ${islogged ? 'logged' : ''}`}>
              {validEmail ? 'SIGN IN' : 'REGISTER'}
            </h2>
          ) : openSMSVerify ? (
            <h2 className={`title-form`}>OTP Verification</h2>
          ) : null}

          {openSMSVerify && (
            <SMSVerify
              dataForm={dataForm}
              setOpenSMSVerify={setOpenSMSVerify}
              setSuccessMessage={setSuccessMessage}
            />
          )}

          {islogged || successMessage?.length || openSMSVerify ? (
            ''
          ) : (
            <>
              <div className={`${!validEmail ? 'd-flex-form' : ''}`}>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label htmlFor="phone" className="animated faster fade-in">
                    {validEmail ? 'Email or phone number*' : 'Email*'}
                  </label>
                  <AdaptiveInput
                    type="text"
                    for="email"
                    name="email"
                    label={`Enter email ${validEmail ? ' or phone number' : ''}`}
                    value={dataForm.email}
                    handleChange={handleChange}
                    validate={validEmail ? false : true}
                    validateContent={validateForm.email}
                    handleBlurInput={checkValidEmail}
                  />
                </div>
                {!validEmail ? (
                  <div className="form-group phone-input">
                    <label htmlFor="phone" className="animated faster fade-in">
                      Phone number*
                    </label>
                    <AdaptiveInput
                      type="text"
                      for="Phone number"
                      label="Phone number"
                      name="phone"
                      value={dataForm.phone}
                      validate={true}
                      validateContent={validateForm.phone}
                      handleChange={handleChange}
                    />
                    <div
                      className="input-description"
                      style={{ fontSize: '0.7em', lineHeight: '190%' }}
                    >
                      An OTP will be sent to your number
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className={`${!validEmail ? 'd-flex-form' : ''}`}>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  {validEmail ? (
                    <label htmlFor="password" className="animated faster fade-in">
                      Enter your password to login
                    </label>
                  ) : (
                    <label htmlFor="password" className="animated faster fade-in">
                      Password*
                    </label>
                  )}

                  <AdaptiveInput
                    type="password"
                    for="password"
                    name="password"
                    label="Enter password"
                    value={dataForm.password}
                    validate={true}
                    validateContent={validateForm.password}
                    handleChange={handleChange}
                  />
                </div>
                {!validEmail ? (
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label htmlFor="password_confirm" className="animated faster fade-in">
                      Password confirm*
                    </label>

                    <AdaptiveInput
                      type="password"
                      for="password_confirm"
                      name="password_confirm"
                      label="Enter password confirm"
                      value={dataForm.password_confirm}
                      validate={true}
                      validateContent={validateForm.password_confirm}
                      handleChange={handleChange}
                    />
                  </div>
                ) : (
                  ''
                )}
              </div>
              {!validEmail ? (
                <div className="d-flex-form">
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label htmlFor="first_name" className="animated faster fade-in">
                      First name*
                    </label>
                    <AdaptiveInput
                      type="text"
                      for="first_name"
                      name="firstName"
                      label="Enter first name"
                      value={dataForm.firstName}
                      validate={true}
                      validateContent={validateForm.firstName}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label htmlFor="last_name" className="animated faster fade-in">
                      Last name*
                    </label>
                    <AdaptiveInput
                      type="text"
                      for="last_name"
                      name="lastName"
                      label="Enter last name"
                      value={dataForm.lastName}
                      validate={true}
                      validateContent={validateForm.lastName}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label htmlFor="last_name" className="animated faster fade-in">
                      Enter your birthday
                    </label>
                    <AdaptiveInput
                      type="date"
                      for="birthday"
                      name="birthday"
                      label=""
                      value={dataForm.birthday}
                      validate={true}
                      validateContent={validateForm.birthday}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="form-group select-group">
                    <label htmlFor={'gender'} className="text-help animated faster fade-in">
                      Enter gender
                    </label>
                    <Select
                      placeholder="Select"
                      className="primary-select"
                      name="gender"
                      required={false}
                      searchable={false}
                      labelField="name"
                      onChange={(e: any) => {
                        handleChangeSelect('gender', e);
                      }}
                      valueField="name"
                      options={[
                        { id: 1, name: 'Other' },
                        { id: 2, name: 'Male' },
                        { id: 3, name: 'Female' },
                      ]}
                      multi={false}
                      values={[]}
                    />
                  </div>

                  <div className="newsletter-text">
                    I consent to Sundora and its service providers, sending me marketing
                    information and materials of Sundora&apos;s and its partners&apos;
                    products, services and events, by the following methods:
                  </div>
                  <div className="newsletter">
                    <label className="checkbox-button" htmlFor="newsletter_email">
                      <input
                        type="checkbox"
                        className="checkbox-button__input"
                        id="newsletter_email"
                        name="newsletter_email"
                        onChange={(e) => handleChange(e, true)}
                        checked={dataForm.newsletter_email}
                      />
                      <div className="checkbox-button__control"></div>
                    </label>
                    <label className="checkbox-button__label" htmlFor="newsletter_email">
                      Email
                    </label>
                    &nbsp;
                    <label className="checkbox-button" htmlFor="newsletter_sms">
                      <input
                        type="checkbox"
                        className="checkbox-button__input"
                        id="newsletter_sms"
                        name="newsletter_sms"
                        onChange={(e) => handleChange(e, true)}
                        checked={dataForm.newsletter_sms}
                      />
                      <div className="checkbox-button__control"></div>
                    </label>
                    <label className="checkbox-button__label" htmlFor="newsletter_sms">
                      SMS
                    </label>
                  </div>
                </div>
              ) : (
                <></>
              )}
              {renderLoginError()}
              {stateUser.loginRequestStatus.inProgress ? <DotLoader /> : null}
              {validEmail ? (
                <div className="submit-box" style={{ flexWrap: 'wrap' }}>
                  <button className="btn-forgot-password" onClick={() => setValidEmail(false)}>
                    Register
                  </button>
                  <button
                    className="btn-primary"
                    onClick={(event) => handleLogin(event)}
                    disabled={stateUser.loginRequestStatus.inProgress}
                  >
                    SIGN IN
                  </button>
                  {validEmail ? (
                    <div
                      style={{
                        flexBasis: '100%',
                        marginLeft: 'auto',
                        alignSelf: 'flex-end',
                        textAlign: 'right',
                        fontSize: 14,
                        marginTop: '1rem',
                      }}
                    >
                      <a
                        className="btn-forgot-password"
                        style={{ cursor: 'pointer' }}
                        onClick={directForgotPassword}
                      >
                        Forgot password?
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="submit-box" style={{ flexWrap: 'wrap' }}>
                  <button className="btn-forgot-password" onClick={() => setValidEmail(true)}>
                    Sign in
                  </button>
                  <button className="btn-primary" onClick={(event) => handleregister(event)}>
                    REGISTER
                  </button>
                  <div className="terms-cond">
                    By signing up you confirm that you have read and accepted our{' '}
                    <Link to={'/about-us/terms-conditions'} onClick={handelToggleModal}>
                      {' '}
                      Terms & conditions
                    </Link>{' '}
                    and{' '}
                    <Link to={'/about-us/privacy-policy'} onClick={handelToggleModal}>
                      Privacy Policy
                    </Link>
                  </div>
                  {validEmail ? (
                    <div
                      style={{
                        marginLeft: 'auto',
                        alignSelf: 'flex-end',
                        textAlign: 'right',
                        fontSize: 14,
                        marginTop: '1rem',
                      }}
                    >
                      <a
                        className="btn-forgot-password"
                        style={{ cursor: 'pointer' }}
                        onClick={directForgotPassword}
                      >
                        Forgot password?
                      </a>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
      </BlockModal>
    </section>
  );
}
export default LoginModal;
