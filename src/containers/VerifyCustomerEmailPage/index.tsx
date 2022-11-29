import { get, isEmpty } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Loader from '../../components/Loader';
import { GET_VERIFY_CUSTOMER_EMAIL, NAV_PAGE_SLUG } from '../../config';
import { fetchClient, fetchCMSHomepage } from '../../redux/Helpers';
import cancel from '../../images/icons/cancel-payment.svg';
import verified from '../../images/icons/successful-payment.svg';
import DotLoader from '../../components/DotLoader';
import * as action from '../../redux/auth/actions';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

function VerifyCustomerEmailPage(props: any): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [verifyLoading, setVerifyLoading] = useState(true);
  const [verifyError, setVerifyError] = useState(false);
  const [verifySuccessMessage, setVerifySuccessMessage] = useState('');
  const [dataFooter, setDataFooter] = useState<any>([]);

  const dispatch = useDispatch();
  const location = useLocation();

  const fetchDataInit = async () => {
    const draftOrder = location.search;

    if (isEmpty(dataFooter)) {
      const pending = [fetchCMSHomepage(NAV_PAGE_SLUG)];
      try {
        const results = await Promise.all(pending);
        const cmsData = results[0];
        const dataDynamicLinks = get(cmsData, 'dynamic_links');
        setDataFooter(dataDynamicLinks?.footer);
        setLoading(false);
        const uuid = props?.match?.params?.id ? props?.match?.params?.id : undefined;
        if (uuid) {
          console.log(`${GET_VERIFY_CUSTOMER_EMAIL}${uuid}${draftOrder}`);
          setVerifyLoading(true);
          const options = {
            url: `${GET_VERIFY_CUSTOMER_EMAIL}${uuid}${draftOrder}`,
            method: 'GET',
            body: null,
          };
          fetchClient(options).then((res) => {
            if (res.success) {
              if (!res?.data?.token) {
                setVerifySuccessMessage('Email already verified');
              } else {
                dispatch(action.verificationSuccessActions(res?.data));
                setVerifySuccessMessage('Email verified');
              }
              setVerifyLoading(false);
            } else if (res.isError) {
              setVerifyLoading(false);
              setVerifyError(true);
            }
          });
        }
      } catch (error) {
        // toastrError(error.message);
        // this.props.loadingPage(false);
      }
    }
  };

  useEffect(() => {
    fetchDataInit();
  }, []);

  return (
    <div className="site-verifyEmail">
      {loading ? <Loader /> : ''}
      <div
        style={{ paddingBottom: '85px', minHeight: '81vh', paddingTop: '12%' }}
        className="container"
      >
        <div className="row">
          <div className="col-12">
            {verifyLoading ? (
              <section className="verify">
                <h4>Verifying</h4>
                <DotLoader />
              </section>
            ) : !verifyLoading && !verifyError ? (
              <div className="status-box">
                <img src={verified} alt="verified" />
                <h4>{verifySuccessMessage}</h4>
              </div>
            ) : (
              <div className="status-box">
                <img src={cancel} alt="failed" />
                <h3>OOPS!</h3>
                <h4>Email verification failed</h4>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer data={dataFooter} />
    </div>
  );
}

export default memo(VerifyCustomerEmailPage);
