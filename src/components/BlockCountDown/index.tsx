import React, { useState, useEffect, memo } from 'react';
// import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import Picture from '../Picture';
import { moneyFormater } from '../../redux/Helpers';
import bgCountdownX from '../../images/block-countdown/right-bg-countdown-x.webp';
import bgCountdownY from '../../images/block-countdown/right-bg-countdown-y.webp';
import { isMobile } from '../../DetectScreen';

function BlockCountDown({ data = {}, timestamp = '' }: { data: any; timestamp: any }) {
  const [time, setTime] = useState<any>();
  const history = useHistory();
  const directDetailProduct = (data: any) => {
    history.push('/brand/' + data?.brand_page?.page_ptr.handle + '/' + data?.handle);
  };
  const beforeMidnight = (finalDate: any) => {
    const today = moment(new Date(timestamp)).format('YYYY-MM-DD');
    const dateRest = moment(finalDate, 'YYYY-MM-DD').format('YYYY-MM-DD');

    const isBeforeDate = moment(today).isSameOrBefore(dateRest);
    if (isBeforeDate) {
      const now = new Date(timestamp);
      const hoursleft = 23 - now.getHours();
      let minutesleft = 59 - now.getMinutes();
      let secondsleft = 59 - now.getSeconds();

      //format 0 prefixes
      if (minutesleft < 10) minutesleft = 0 + minutesleft;
      if (secondsleft < 10) secondsleft = 0 + secondsleft;

      setTime({
        hours: hoursleft,
        minutes: minutesleft,
        seconds: secondsleft,
      });
    } else {
      setTime({
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }
  };
  useEffect(() => {
    data.final_date ? beforeMidnight(data.final_date) : '';
  }, [data]);
  useEffect(() => {
    if (!time) return;

    const intervalId = setInterval(() => {
      const c_seconds = convertToSeconds(time.hours, time.minutes, time.seconds);
      c_seconds <= 0 ? clearInterval(intervalId) : countDown();
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [time]);

  const convertToSeconds = (hours: any, minutes: any, seconds: any) => {
    return seconds + minutes * 60 + hours * 60 * 60;
  };

  const countDown = () => {
    const c_seconds = convertToSeconds(time.hours, time.minutes, time.seconds);
    if (c_seconds) {
      // seconds change
      time.seconds > 0
        ? setTime((prevState: any) => ({
            ...prevState,
            seconds: prevState.seconds - 1,
          }))
        : setTime((prevState: any) => ({
            ...prevState,
            seconds: 59,
          }));

      // minutes change
      if (c_seconds % 60 === 0 && time.minutes) {
        setTime((prevState: any) => ({
          ...prevState,
          minutes: prevState.minutes - 1,
        }));
      }

      if (!time.minutes && time.hours) {
        setTime((prevState: any) => ({
          ...prevState,
          minutes: 59,
        }));
      }

      // hours change
      if (c_seconds % 3600 === 0 && time.hours) {
        setTime((prevState: any) => ({
          ...prevState,
          hours: prevState.hours - 1,
        }));
      }
    }
  };
  return (
    <section className="blk-countdown">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-12 p-0">
            <div className="section-square">
              {data?.image ? (
                <div className="bg-image">
                  <Picture data={data?.image} />
                </div>
              ) : (
                ''
              )}
              <div className="product-image">
                <Picture data={data?.product?.images[0]?.url} />
              </div>
            </div>
          </div>
          <div className="col-md-9 col-12 p-0">
            <div className="wrapper-content">
              <div className="info">
                <p>{data?.text}</p>
                <h2>{data?.product?.name}</h2>
                <p>{data?.product?.brand?.name}</p>
                <p>
                  <span className="price">
                    {moneyFormater(data?.product?.product_variants[0]?.price)}
                  </span>{' '}
                  {/* / {data?.product?.product_variants[0]?.title} */}
                </p>
              </div>
              <div className="countdown-box">
                <h3>
                  {data?.nof_items} <span>left</span>
                </h3>
                {/* to={data?.product?.id ? 'product/' + data?.product?.id : '/'}  */}
                <button onClick={() => directDetailProduct(data?.product)}>
                  Get your now
                </button>
                <div className="time-group">
                  <ul>
                    <li>
                      <p id="hours">{time?.hours}</p>Hrs
                    </li>
                    :
                    <li>
                      <p id="minutes">{time?.minutes}</p>Mins
                    </li>
                    :
                    <li>
                      <p id="seconds">{time?.seconds}</p>Secs
                    </li>
                  </ul>
                </div>
              </div>
              <img
                className="right-bg"
                src={isMobile ? bgCountdownY : bgCountdownX}
                loading="lazy"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// BlockCountDown.propTypes = {
//   item: PropTypes.object,
// };

export default memo(BlockCountDown);
