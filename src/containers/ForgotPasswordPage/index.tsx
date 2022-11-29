import React, { useRef, useState, useEffect, memo } from 'react';
import Footer from '../../components/Footer/index';
import { fetchClient, fetchCMSHomepage, validateEmail } from '../../redux/Helpers';
import { isEmpty, get } from 'lodash';
import './styles.scss';
import resetPassImg from '../../images/icons/reset-password.png';
import Loader from '../../components/Loader';
import AdaptiveInput from '../../components/CheckoutForm/AdaptiveInput';
import { NAV_PAGE_SLUG, POST_RESET_PASSWORD } from '../../config';
import successful from '../../images/icons/successful-payment.svg';
import LdsLoader from '../../components/LdsLoader';

function ForgotPasswordPage(): JSX.Element {
  const refFooter = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  const [dataNav, setDataNav] = useState<any>([]);
  const [dataFooter, setDataFooter] = useState<any>([]);
  const [dataCmsBody, setDataCmsBody] = useState<any>([]);
  const [metaData, setMetaData] = useState<any>({});
  const [isCheckPasswordSuccess, setIsCheckPasswordSuccess] = useState<any>(false);

  const [dataForm, setDataForm] = useState<any>({ email: '' });

  const [validateForm, setValidateForm] = useState<any>({ email: '' });
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);

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
      } catch (error) {
        // toastrError(error.message);
        // this.props.loadingPage(false);
      }
    }
  };

  useEffect(() => {
    fetchDataInit();
  }, []);
  const handleChange = (event: any) => {
    setDataForm({ ...dataForm, [event.currentTarget.name]: event.target.value });
  };

  const checkValidEmail = () => {
    if (!dataForm.email) {
      return 'Please enter email';
    }
    const validEmail = validateEmail(dataForm.email.trim());

    if (validEmail == false) {
      return `Please enter valid email`;
    }
  };

  const checkValidForm = () => {
    const validEmail = checkValidEmail();
    setValidateForm({
      ...validateForm,
      ...{
        email: validEmail,
      },
    });
    if (validEmail) {
      return true;
    } else {
      return false;
    }
  };

  const submit = () => {
    const valid = checkValidForm();
    if (!valid) {
      setIsFormSubmitting(true);
      const options = {
        url: POST_RESET_PASSWORD,
        method: 'POST',
        body: {
          email: (dataForm.email as string)?.toLowerCase(),
        },
      };
      fetchClient(options)
        .then((res) => {
          if (res.success) {
            setIsCheckPasswordSuccess(true);
          } else if (res.isError) {
          }
        })
        .finally(() => {
          setIsFormSubmitting(false);
        });
    }
  };
  return (
    <div className="site-forgotPassword">
      {loading ? <Loader /> : ''}
      {/* <Banner /> */}
      {/* {dataNav && isMobile ? <NavigationMobile data={dataNav} /> : ''}
      {dataNav && !isMobile ? <Navigation data={dataNav} /> : ''} */}
      <div className="container section-container">
        <div className="row">
          <div className="col-sm-12 col-lg-6">
            <img src={resetPassImg} alt="" className="resp-ic" />
          </div>
          <div className="col-sm-12 col-lg-6">
            {!isCheckPasswordSuccess ? (
              <div className="form-forgot-password">
                <h1>Forgot your password</h1>
                <p>
                  Enter the email address and we will send you a link to reset your password.
                </p>
                <div className="form-group">
                  <AdaptiveInput
                    type="text"
                    for="email"
                    name="email"
                    label="Enter email"
                    value={dataForm.email}
                    handleChange={handleChange}
                    validate={validateForm.email ? true : false}
                    validateContent={validateForm.email}
                    //   handleBlurInput={checkValidEmail}
                  />
                  <div className="button-group">
                    <div className="loader-container">
                      {isFormSubmitting && <LdsLoader classes="loader" />}
                    </div>
                    <button className="reset-btn" disabled={isFormSubmitting} onClick={submit}>
                      Reset password
                    </button>

                    {/* <button className="back-btn">back to home page</button> */}
                  </div>
                </div>
              </div>
            ) : (
              <div className="status-box">
                <img src={successful} alt="" />
                <h3>Password reset request sent</h3>
                <h4>
                  A password reset message was sent to your email address. Please click the
                  link in that message to countinue
                </h4>
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

export default memo(ForgotPasswordPage);
