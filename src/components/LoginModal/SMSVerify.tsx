import axios from 'axios';
import React, { useState } from 'react';
import AdaptiveInput from '../CheckoutForm/AdaptiveInput';
import { POST_SEND_VERIFY_SMS_CODE, VERIFY_SMS } from '../../config';
import { useDispatch } from 'react-redux';
import * as action from '../../redux/auth/actions';
import { toastrError, toastrSuccess } from '../../redux/Helpers';

const SMSVerify = (props: any) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState<any>('');
  const [errorMessage, setErrorMessage] = useState<any>('');
  const [loadingResend, setLoadingResend] = useState<any>(false);

  const isNumeric = (num: any) =>
    (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) &&
    !isNaN(num as number);

  const handleChange = (e: any) => {
    const value: any = e.target.value;
    if (value?.length > 0 && (value?.length > 6 || !isNumeric(value))) {
      return;
    }
    setCode(e.target.value);
  };

  const handleVerify = () => {
    axios
      .post(VERIFY_SMS, {
        email: props?.dataForm?.email,
        phone: props?.dataForm?.phone,
        verify_sms_code: code,
      })
      .then((res: any) => {
        if (res.data?.data) {
          dispatch(action.verificationSuccessActions(res.data?.data));
        } else {
          props?.setOpenSMSVerify && props?.setOpenSMSVerify(false);
          props?.setSuccessMessage && props?.setSuccessMessage(`Redirecting in 5 seconds ...`);
          props?.setSuccessMessage &&
            setTimeout(() => {
              dispatch(action.toggleModalLoginActions(false));
              window.location.reload();
            }, 5000);
        }
      })
      .catch(() => {
        setErrorMessage('Code incorrect or expired');
      });
  };

  const handleResend = () => {
    setLoadingResend(true);
    axios
      .post(POST_SEND_VERIFY_SMS_CODE, {
        email: props?.dataForm?.email || props?.dataForm?.phone,
      })
      .then(() => {
        setLoadingResend(false);
        toastrSuccess('Resend successfully');
      })
      .catch(() => {
        setLoadingResend(false);
        toastrError('User does not exist');
      });
  };

  return (
    <div className="sms-verify">
      <AdaptiveInput
        type="text"
        for="email"
        name="email"
        label={`Enter the 6-digit verification code`}
        value={code}
        handleChange={handleChange}
        validate={errorMessage ? true : false}
        validateContent={errorMessage}
        // handleBlurInput={checkValidEmail}
      />
      <div className="verify-description">Verification code expires in 15 minutes</div>
      <div className="verify-buttons">
        <button
          className={`btn`}
          onClick={handleResend}
          disabled={loadingResend}
          style={{ flex: 0.7 }}
        >
          {loadingResend ? 'Resending...' : 'Resend OTP'}
        </button>
        <button
          className={`btn ${code?.length < 6 && 'disable'}`}
          disabled={code?.length < 6}
          onClick={handleVerify}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default SMSVerify;
