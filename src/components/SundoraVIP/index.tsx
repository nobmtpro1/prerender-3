import React, { useEffect, useState } from 'react';
import orderIc from '../../images/icons/document.svg';
import packageIc from '../../images/icons/package.svg';
import moment from 'moment';
import './sundora-vip.scss';
import BlockProduct from '../BlockProduct';
import { isMobile, isTablet } from '../../DetectScreen';
import { isEmpty } from 'lodash';
import { GET_SUNDORA_VIP } from '../../config';
import { fetchClient } from '../../redux/Helpers';
import { Link } from 'react-router-dom';
import PointCircle from './PointCircle';
import RewardHistory from '../RewardHistory';

const SundoraVIP = (): JSX.Element => {
  const [loading, setLoading] = useState<any>(true);
  const [dataSundoraVIP, setDataSundoraVIP] = useState<any>({});

  const fetchDataInit = async () => {
    if (isEmpty(dataSundoraVIP)) {
      const options = {
        url: `${GET_SUNDORA_VIP}`,
        method: 'GET',
        body: null,
      };
      try {
        const res = await fetchClient(options);
        if (res?.success) {
          // console.log(res?.data);
          setDataSundoraVIP(res.data);
          setLoading(false);
        }
      } catch (error) {
        // toastrError(error.message);
      }
    }
  };

  useEffect(() => {
    fetchDataInit();
  }, []);
  return (
    <section className="tab-SundoraVIP animated faster fadeIn">
      <div className="col-12 row title">
        {/* <h1 className="col-12 text-header">SUNDORA VIP</h1> */}
        <h3 className="col-12 text-header tier-name">{dataSundoraVIP?.tier?.name}</h3>
      </div>
      {loading ? (
        <div className="wrapper-loading">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            {/* VIP POINTS */}
            <div className="col-12 row slide vip-point">
              <div className="col-12 col-md-3">
                <h3 className="text-title">VIP points</h3>
              </div>
              <div className="col-6 col-md-3 circle-point">
                <PointCircle pointData={dataSundoraVIP} />
                {/* <div className="circular">
                <div className="inner"></div>
                <div className="text-circle">
                  <p className="title">{dataSundoraVIP?.points ?? 0}</p>
                  <p className="sub">points</p>
                </div>
                <div className="circle">
                  <div className="bar left">
                    <div
                      className="progress"
                      style={{ transform: `rotate(${circleProgressBar.left}deg)` }}
                    ></div>
                  </div>
                  <div className="bar right">
                    <div
                      className="progress"
                      style={{ transform: `rotate(${circleProgressBar.right}deg)` }}
                    ></div>
                  </div>
                </div>
              </div> */}
              </div>
              <div className="col-6 col-md-3 plus-point d-table">
                <div className="center-tb">
                  <p className="text-number">
                    {dataSundoraVIP?.tier?.next_tier?.needed_points ?? 0}
                  </p>
                  {dataSundoraVIP?.tier?.next_tier ? (
                    <>
                      <p className="text-subtitle px-3">points to next loyalty level</p>
                      <p className="text-type">
                        {dataSundoraVIP?.tier?.next_tier?.name ?? ''}
                      </p>
                    </>
                  ) : (
                    <p>You have reached the maximum level</p>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-3 sub-point d-table">
                {dataSundoraVIP?.last_minus_log?.created_at ? (
                  <p className="center-tb">
                    On{' '}
                    <span className="font-weight-bold">
                      {dataSundoraVIP?.last_minus_log?.date_will_be_deleted
                        ? moment(dataSundoraVIP?.last_minus_log?.date_will_be_deleted).format(
                            'Do MMMM YYYY',
                          )
                        : ''}
                    </span>{' '}
                    <br />
                    <span>you will have</span>{' '}
                    <span className="text-point">
                      {dataSundoraVIP?.last_minus_log?.bonus_points ?? 0} points
                    </span>{' '}
                    <span>that expire</span>
                  </p>
                ) : (
                  <p className="center-tb">You have no points deducted</p>
                )}
              </div>
            </div>

            {/* SHIPPING STATUS */}
            <div className="col-12 row slide shipping-status">
              <div className="col-12 col-md-3">
                <h3 className="text-title">Shipping status</h3>
              </div>
              <div className="col-12 col-md-3 delevery p-3">
                {dataSundoraVIP?.order?.status == 'fulfilled' ? (
                  <div className="delevery-info">
                    <img src={packageIc} alt="" className="package-ic" />
                    <p className="status">
                      <i className="gg-check"></i> Completed
                    </p>
                  </div>
                ) : dataSundoraVIP?.order?.status == 'cancelled' ? (
                  <div className="delevery-info">
                    <img src={orderIc} alt="" style={{ marginLeft: '3.3em' }} />
                    <p className="status">
                      <i className="gg-check"></i> Cancelled
                    </p>
                  </div>
                ) : dataSundoraVIP?.order?.status == 'in_transit' ? (
                  <div className="delevery-info">
                    <img src={orderIc} alt="" style={{ marginLeft: '3.3em' }} />
                    <p className="status">
                      <i className="gg-check"></i> In transit
                    </p>
                  </div>
                ) : dataSundoraVIP?.order?.status == 'unfulfilled' ? (
                  <div className="delevery-info">
                    <img src={orderIc} alt="" />
                    <p className="status">
                      <i className="gg-check"></i> Order placed
                    </p>
                  </div>
                ) : (
                  <div className="delevery-info">
                    <img src={orderIc} alt="" />
                  </div>
                )}
              </div>
              <div className="col-12 col-md-3 d-table px-3">
                {dataSundoraVIP?.order?.order ? (
                  <p className="center-tb">
                    Your order{' '}
                    <span className="text-primary font-weight-bold">
                      {dataSundoraVIP?.order?.order?.name}
                    </span>{' '}
                    {dataSundoraVIP?.order?.status == 'fulfilled'
                      ? 'has been completed'
                      : dataSundoraVIP?.order?.status == 'cancelled'
                      ? 'has been cancelled'
                      : dataSundoraVIP?.order?.status == 'in_transit'
                      ? 'is shipping'
                      : dataSundoraVIP?.order?.status == 'unfulfilled'
                      ? 'has been placed'
                      : ''}
                  </p>
                ) : (
                  <p className="center-tb">No order placed yet</p>
                )}
              </div>
              <div className={`col-lg-3 col-md-3 col-sm-12 d-table ${isMobile ? 'py-3' : ''}`}>
                <div
                  className={`row btn-group ${
                    isMobile ? (!isTablet ? '' : 'center-tb') : 'center-tb'
                  }`}
                >
                  {!dataSundoraVIP?.order || dataSundoraVIP?.order?.status == 'cancelled' ? (
                    ''
                  ) : (
                    <div className="col-lg-12 col-md-12 col-6">
                      <a target="blank" href={dataSundoraVIP?.order?.tracking_url}>
                        <button className="btn-ship">Track order</button>
                      </a>
                    </div>
                  )}
                  <div className="col-lg-12 col-md-12 col-6">
                    <Link to="/account/order-history">
                      <button className="btn-ship btn-out-line font-weight-bold">
                        View my orders
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* VIP OFFERS FEBRUARY */}
            {dataSundoraVIP?.tier?.products?.length > 0 ? (
              <div className="row slide vip-offers rm-border-bt">
                <div className="col-12">
                  <h3 className="text-title">
                    VIP offers{' '}
                    <span className="text-primary font-weight-bold">
                      {moment().format('MMMM')}
                    </span>
                  </h3>
                </div>
                <div className="col-12 p-0">
                  <BlockProduct productList={dataSundoraVIP?.tier?.products} title={''} />
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="row">
            <RewardHistory />
          </div>
        </>
      )}
    </section>
  );
};

export default SundoraVIP;
