import React, { useRef, useState, useEffect, memo } from 'react';
import Footer from '../../components/Footer/index';
// import Navigation from '../../components/Navigation';
import {
  fetchClient,
  fetchCMSHomepage,
  toastrError,
  toastrSuccess,
} from '../../redux/Helpers';
import { isEmpty, get } from 'lodash';
import './styles.scss';
import resetPassImg from '../../images/icons/reset-password.png';
import Loader from '../../components/Loader';
import AdaptiveInput from '../../components/CheckoutForm/AdaptiveInput';
import { NAV_PAGE_SLUG, POST_VERIFY_RESET_PASSWORD } from '../../config';
import cancel from '../../images/icons/cancel-payment.svg';
import successful from '../../images/icons/successful-payment.svg';
import { useHistory } from 'react-router';

function VerifyForgotPasswordPage(props: any): JSX.Element {
  const refFooter = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  const [dataNav, setDataNav] = useState<any>([]);
  const [dataFooter, setDataFooter] = useState<any>([]);
  const [dataCmsBody, setDataCmsBody] = useState<any>([]);
  const [metaData, setMetaData] = useState<any>({});
  const [isCheckPasswordSuccess, setIsCheckPasswordSuccess] = useState<any>(false);
  const [changePassSuccess, setcChangePassSuccess] = useState<any>(false);

  const [dataForm, setDataForm] = useState<any>({ password: '', confirm_password: '' });

  const [validateForm, setValidateForm] = useState<any>({ password: '' });

  const fetchDataInit = async () => {
    if (isEmpty(dataNav) || isEmpty(dataCmsBody) || isEmpty(dataFooter) || isEmpty(metaData)) {
      // this.props.loadingPage(true);
      const pending = [fetchCMSHomepage(NAV_PAGE_SLUG)];
      try {
        const results = await Promise.all(pending);
        const cmsData = results[0];
        const dataDynamicLinks = get(cmsData, 'dynamic_links');
        setDataCmsBody(cmsData.body);
        setMetaData(cmsData.meta);
        setDataNav(dataDynamicLinks?.navigation);
        setDataFooter(dataDynamicLinks?.footer);
        setLoading(false);
        const uuid = props?.match?.params?.id ? props?.match?.params?.id : undefined;
        if (uuid) {
          const options = {
            url: `${POST_VERIFY_RESET_PASSWORD}${uuid}/verify-uuid/`,
            method: 'POST',
            body: null,
          };
          fetchClient(options).then((res) => {
            if (res.success) {
              setIsCheckPasswordSuccess(true);
            } else if (res.isError) {
              setIsCheckPasswordSuccess(undefined);
            }
          });
        }
      } catch (error) {
        // toastrError(error.message);
        // this.props.loadingPage(false);
      }
    }
  };
  const history = useHistory();
  useEffect(() => {
    fetchDataInit();
  }, []);
  const handleChange = (event: any) => {
    setDataForm({ ...dataForm, [event.currentTarget.name]: event.target.value });
  };

  const checkValidPassword = () => {
    if (dataForm.password != dataForm.confirm_password) {
      return `Password confirmation doesn't match password`;
    }
  };

  const checkValidForm = () => {
    const validPass = checkValidPassword();
    setValidateForm({
      ...validateForm,
      ...{
        password: validPass,
      },
    });
    if (validPass) {
      return true;
    } else {
      return false;
    }
  };

  const submit = () => {
    const valid = checkValidForm();
    const uuid = props?.match?.params?.id ? props?.match?.params?.id : undefined;
    if (!valid && uuid) {
      const options = {
        url: `${POST_VERIFY_RESET_PASSWORD}${uuid}/confirm/`,
        method: 'POST',
        body: {
          password: dataForm.password,
          confirm_password: dataForm.confirm_password,
        },
      };
      fetchClient(options).then((res) => {
        if (res.success) {
          toastrSuccess('Reset password successfully');
          setcChangePassSuccess(true);
          setTimeout(() => {
            history.push('/');
          }, 2000);
        } else if (res.isError) {
          toastrError('Reset password fail, please try again');
        }
      });
    }
  };
  return (
    <div className="site-forgotPassword">
      {loading ? <Loader /> : ''}
      {/* <Banner /> */}
      <div
        style={{ paddingBottom: '85px', minHeight: '81vh', paddingTop: '12%' }}
        className="container"
      >
        <div className="row">
          <div className="col-6">
            <img src={resetPassImg} alt="" className="resp-ic" />
          </div>
          <div className="col-6">
            {isCheckPasswordSuccess == true ? (
              !changePassSuccess ? (
                <div className="form-forgot-password">
                  <h1>Reset password</h1>
                  <div className="form-group">
                    <div className="col-12">
                      <AdaptiveInput
                        type="password"
                        for="Password"
                        label="Password"
                        name="password"
                        value={dataForm?.password || ''}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-12" style={{ marginTop: 16 }}>
                      <AdaptiveInput
                        type="password"
                        for="Confirm password"
                        label="Confirm password"
                        name="confirm_password"
                        value={dataForm?.confirm_password || ''}
                        validate={true}
                        handleChange={handleChange}
                        validateContent={validateForm.password}
                        // validateContent="Password must be at least 8 character lorem dolor sit amet consectetur"
                      />
                    </div>
                    <div className="button-group">
                      <button className="reset-btn" onClick={submit}>
                        Reset password
                      </button>
                      {/* <button className="back-btn">back to home page</button> */}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="status-box">
                  <img src={successful} alt="" />
                  <h3>Password change successful</h3>
                  <h4 style={{ fontWeight: 400 }}>
                    Your password was successfully changed. redirect to home page
                  </h4>
                </div>
              )
            ) : isCheckPasswordSuccess == false ? (
              <section className="verify">
                <h4>Verifying</h4>
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </section>
            ) : (
              <div className="status-box">
                <img src={cancel} alt="" />
                <h3>OOP!</h3>
                <h4>Something went wrong. Please try again</h4>
              </div>
            )}
          </div>
        </div>
      </div>
      <div ref={refFooter}>
        <Footer data={dataFooter} />
      </div>
    </div>
  );
}

export default memo(VerifyForgotPasswordPage);
