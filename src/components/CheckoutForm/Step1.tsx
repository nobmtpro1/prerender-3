import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AdaptiveInput from './AdaptiveInput';
import { RootStateOrAny, useSelector } from 'react-redux';
import { PHONE_CONTACT, POST_CHECK_VALID_EMAIL } from '../../config';
import {
  fetchClient,
  formatPhoneNumber,
  validateEmail,
  validatePhone,
} from '../../redux/Helpers';
import Select from 'react-dropdown-select';
import SMSVerify from '../LoginModal/SMSVerify';

function Step1(props: any) {
  if (props.currentStep !== 1) {
    return <></>;
  }
  const stateUser = useSelector((state: RootStateOrAny) => state.userReducer);
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [canToggle, setCanToggle] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(true);
  const [isInit, setIsInit] = useState<boolean>(true);
  const [validateForm, setValidateForm] = useState<any>({
    email: '',
    username: '',
    password: '',
    phone: '',
    firstName: '',
    lastName: '',
    birthday: '',
  });
  const [openSMSVerify, setOpenSMSVerify] = useState<boolean>(false);
  const [SMSVerifyData, setSMSVerifyData] = useState<any>(null);

  const islogged = localStorage.getItem('sundoraToken');

  const validateEmailGuest = () => {
    const validCheckEmail = validateEmail(props.data.email.trim());

    if (validCheckEmail == false) {
      return `Please enter valid email`;
    }
  };

  const checkValidEmail = () => {
    // if (validEmail) {
    // if (!props.data.email) {
    //   return 'Please enter email';
    // }
    const validCheckPhone = validatePhone(props.data.email?.trim());
    const validCheckEmail = validateEmail(props.data.email?.trim());

    const options = {
      url: POST_CHECK_VALID_EMAIL,
      method: 'POST',
      body: {
        email: props.data.email.trim().toLowerCase().trim(),
      },
    };
    fetchClient(options).then((res) => {
      if (res.success) {
        setValidEmail(true);
      } else if (res.isError) {
        setValidEmail(false);
        if (!validCheckEmail && validCheckPhone) {
          props.handleEmailPhoneChange('', props.data.email);
        }
      }
    });
    if (!validCheckEmail && !validCheckPhone) {
      return `Please enter valid email or phone number`;
    }
    setIsInit(false);
    // }
  };

  const checkValidPassword = () => {
    if (!props.data.password || props.data?.password == '') {
      return 'Please enter password';
    }
    const validPassword = props.data.password.length >= 8;

    if (validPassword == false) {
      return `Please enter a password of more than 8 characters`;
    }
  };

  const checkValidPhoneGuest = () => {
    if (!props.data.phone || props.data?.phone == '') {
      return 'Please enter phone number';
    }
    const phone = formatPhoneNumber(props.data.phone);
    const validPhone = validatePhone(phone);
    if (validPhone == false) {
      return `Error phone, Need help? Please call: ${PHONE_CONTACT}`;
    }
  };

  const checkValidPhone = async () => {
    if (!props.data.phone || props.data?.phone == '') {
      return 'Please enter phone number';
    }
    const phone = formatPhoneNumber(props.data.phone);
    const validPhone = validatePhone(phone);
    if (validPhone == false) {
      return `Error phone, Need help? Please call: ${PHONE_CONTACT}`;
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
    if (!props.data.firstName || props.data?.firstName == '') {
      return 'Please enter first name';
    }
  };

  const checkValidLastName = () => {
    if (!props.data.lastName || props.data?.lastName == '') {
      return 'Please enter last name';
    }
  };

  const checkValidForm = async () => {
    const validEmail = checkValidEmail();
    const validPassword = checkValidPassword();
    const validFirstName = checkValidFirstName();
    const validLastName = checkValidLastName();
    const validPhone = await checkValidPhone();
    setValidateForm({
      ...validateForm,
      ...{
        email: validEmail,
        password: validPassword,
        firstName: validFirstName,
        lastName: validLastName,
        phone: validPhone,
      },
    });

    if (validEmail || validPassword || validFirstName || validLastName || validPhone) {
      return true;
    } else {
      return false;
    }
  };

  const checkValidFormRegisterGuest = () => {
    const validPhone = checkValidPhoneGuest();
    const validFirstName = checkValidFirstName();
    const validLastName = checkValidLastName();
    const validEmail = validateEmailGuest();

    let validPassword = undefined;
    if (props.data.password != '') {
      validPassword = checkValidPassword();
    }

    setValidateForm({
      ...validateForm,
      ...{
        email: validEmail,
        password: validPassword,
        firstName: validFirstName,
        lastName: validLastName,
        phone: validPhone,
      },
    });

    if (validEmail || validPassword || validFirstName || validLastName || validPhone) {
      return true;
    } else {
      return false;
    }
  };

  const handleLoginRegister = async (event: any) => {
    event.preventDefault();
    setSMSVerifyData({
      email: props?.data?.email,
      phone: props?.data?.phone,
    });
    if (validEmail) {
      props.handleLogin(event);
      return;
    }

    const valid = await checkValidForm();
    if (valid) {
      return false;
    }

    props.resetForm();
    setValidEmail(true);
    setIsInit(true);

    props.handleRegister(event);

    setOpenSMSVerify(true);
    window.scrollTo(0, 0);
  };

  const handleRegisterGuest = async (event: any) => {
    event.preventDefault();

    const valid = await checkValidFormRegisterGuest();
    if (valid) {
      return false;
    }
    setMenuOpen(false);
    props.handleRegisterGuest(event);
  };

  useEffect(() => {
    const guest = !!localStorage.getItem('sundora_guest_id');
    if (guest) setCanToggle(true);
    !props.data.email?.length
      ? (() => {
          setValidEmail(true);
          setIsInit(true);
        })()
      : null;
  }, []);

  const history = useHistory();
  const directForgotPassword = () => {
    history.push('/forgot-password');
  };

  const renderLoginError = () => {
    if (
      validEmail &&
      !stateUser.loginRequestStatus.inProgress &&
      stateUser.loginRequestStatus.error
    ) {
      if (
        !stateUser.loginRequestStatus.email_verified &&
        stateUser.loginRequestStatus.exists
      ) {
        return (
          <p className="err-login">
            Email not verified, new magic link has been sent to your email
          </p>
        );
      } else if (
        stateUser.loginRequestStatus.exists &&
        !stateUser.loginRequestStatus.sms_verified
      ) {
        setOpenSMSVerify(true);
      } else return <p className="err-login">Wrong username or password</p>;
    }
    return null;
  };

  const renderVerificationError = () => {
    if (stateUser?.loginRequestStatus?.new_register) {
      return (
        <p className="err-login">A magic link has been sent to your email for verification</p>
      );
    }
    return null;
  };

  return (
    <section className="form-step form-step-1">
      <h2
        style={{ cursor: `${canToggle ? 'pointer' : ''}` }}
        className={`title-form ${islogged || stateUser.user || !menuOpen ? 'logged' : ''}`}
        onClick={() => canToggle && setMenuOpen((state) => !state)}
      >
        <span>
          {islogged || stateUser.user || !menuOpen ? <i className="gg-check"></i> : 1}
        </span>
        {props?.userInfo?.guest ? 'CONTINUE AS GUEST' : 'SIGN IN / GUEST INFO'}
      </h2>

      {openSMSVerify && (
        <SMSVerify dataForm={SMSVerifyData} setOpenSMSVerify={setOpenSMSVerify} />
      )}

      {islogged || stateUser.user || !menuOpen || openSMSVerify ? (
        ''
      ) : (
        <>
          <div className="form-group">
            <AdaptiveInput
              type="text"
              for={'email'}
              name={'email'}
              label={`Enter email ${validEmail ? 'or phone' : ''}*`}
              value={props.data.email}
              handleChange={props.handleChange}
              validate={true}
              validateContent={validateForm.email}
              handleBlurInput={checkValidEmail}
            />
          </div>
          {stateUser?.loginRequestStatus?.inProgress ? (
            <div
              className="lds-roller"
              style={{ transform: 'scale(0.5)', bottom: '-5px', left: '-35px' }}
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
          ) : null}
          {renderVerificationError()}
          {validEmail && !isInit ? (
            <div className="form-group">
              <label htmlFor="password" className="animated faster fade-in">
                Enter your password to login
              </label>
              <AdaptiveInput
                type="password"
                for="password"
                name="password"
                label="Enter password"
                value={props.data.password}
                validate={validEmail ? false : true}
                validateContent={validateForm.password}
                handleChange={props.handleChange}
              />
            </div>
          ) : (
            <></>
          )}

          {!validEmail ? (
            <>
              <div className="form-group ">
                <label htmlFor="password" className="animated faster fade-in">
                  Enter your password to register
                  <span style={{ fontWeight: 'bold' }}>(OPTIONAL)</span>
                </label>
                <AdaptiveInput
                  type="password"
                  for="password"
                  name="password"
                  label="Enter password"
                  value={props.data.password}
                  validate={validEmail ? false : true}
                  validateContent={validateForm.password}
                  handleChange={props.handleChange}
                />
              </div>
              <div className="form-group phone-input">
                <label htmlFor="phone" className="animated faster fade-in">
                  Enter your phone number *
                </label>
                <AdaptiveInput
                  type="text"
                  for="Phone number"
                  label="Phone number"
                  name="phone"
                  value={props.data.phone}
                  validate={true}
                  validateContent={validateForm.phone}
                  handleChange={props.handleChange}
                />
                <div className="input-description">
                  If you register, an OTP will be sent to your number
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="first_name" className="animated faster fade-in">
                  Enter your first name *
                </label>
                <AdaptiveInput
                  type="text"
                  for="first_name"
                  name="firstName"
                  label="Enter first name"
                  value={props.data.firstName}
                  validate={true}
                  validateContent={validateForm.firstName}
                  handleChange={props.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name" className="animated faster fade-in">
                  Enter your last name *
                </label>
                <AdaptiveInput
                  type="text"
                  for="last_name"
                  name="lastName"
                  label="Enter last name"
                  value={props.data.lastName}
                  validate={true}
                  validateContent={validateForm.lastName}
                  handleChange={props.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name" className="animated faster fade-in">
                  Enter your birthday
                </label>
                <AdaptiveInput
                  type="date"
                  for="birthday"
                  name="birthday"
                  label=""
                  value={props.data.birthday}
                  validate={true}
                  validateContent={validateForm.birthday}
                  handleChange={props.handleChange}
                />
              </div>
              <div className="form-group">
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
                    props.handleChangeSelect('gender', e);
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
            </>
          ) : (
            <div></div>
          )}
          {renderLoginError()}
          {/* {validEmail &&
          stateUser.loginRequestStatus.inProgress == false &&
          stateUser.loginRequestStatus.error == true ? (
            <p className="err-login">*wrong username or password</p>
          ) : (
            ''
          )} */}
          {!validEmail ? (
            <div className="row submit-box">
              {/* {props?.loading?.register ? (
                <div
                  className="lds-roller"
                  style={{ transform: 'scale(0.5)', bottom: '-5px', left: '-35px' }}
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
              )} */}
              {stateUser?.loginRequestStatus?.inProgress ? (
                <div
                  className="lds-roller"
                  style={{ transform: 'scale(0.5)', bottom: '-5px', left: '-35px' }}
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
              <button
                style={{
                  width: '100%',
                  border: '0.5px #ffffff solid',
                  cursor: stateUser?.loginRequestStatus?.inProgress ? 'not-allowed' : '',
                }}
                disabled={stateUser?.loginRequestStatus?.inProgress}
                className="col-lg-4 col-sm-5 col-12"
                onClick={(event) => handleLoginRegister(event)}
              >
                REGISTER
              </button>
              <div>
                <span
                  style={{
                    cursor: stateUser?.loginRequestStatus?.inProgress
                      ? 'not-allowed'
                      : 'pointer',
                  }}
                  className="continue-guest col disabled={stateUser?.loginRequestStatus?.inProgress}"
                  onClick={(event) => handleRegisterGuest(event)}
                >
                  CONTINUE AS GUEST
                </span>
              </div>

              {/* {props?.loading?.continueAsGuest ? (
                <div
                  className="lds-roller"
                  style={{ transform: 'scale(0.5)', bottom: '-5px' }}
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
              )} */}
              {/* <button
                className="btn-forgot-password"
                style={{
                  flexBasis: '100%',
                  marginLeft: 'auto',
                  alignSelf: 'flex-end',
                  textAlign: 'right',
                }}
                onClick={(event) => {
                  event.preventDefault();
                  setValidEmail(true);
                }}
              >
                Login
              </button> */}
            </div>
          ) : (
            <div className="submit-box" style={{ flexWrap: 'wrap' }}>
              {validEmail && !isInit ? (
                <>
                  <button
                    type="button"
                    className="btn-forgot-password"
                    onClick={directForgotPassword}
                  >
                    Forgot password?
                  </button>
                  <button type="submit" onClick={(event) => handleLoginRegister(event)}>
                    SIGN IN
                  </button>
                </>
              ) : (
                <></>
              )}

              {/* {!validEmail && !isInit ? (
                <button
                  className="btn-forgot-password"
                  style={{
                    flexBasis: '100%',
                    marginLeft: 'auto',
                    alignSelf: 'flex-end',
                    textAlign: 'right',
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    setValidEmail(false);
                  }}
                >
                  Register
                </button>
              ) : (
                <></>
              )} */}
            </div>
          )}
        </>
      )}
    </section>
  );
}
export default memo(Step1);
