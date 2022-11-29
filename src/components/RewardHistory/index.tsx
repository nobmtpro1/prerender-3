import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { map, groupBy } from 'lodash';
import './reward-history.scss';
import Item, { IRewardHistoryItem } from './Item';
import { fetchClient } from '../../redux/Helpers';
import { GET_TIER_HISTORY } from '../../config';

function RewardHistory() {
  const [dataOrder, setDataOrder] = useState<any>({});
  const [loading, setLoading] = useState<any>(false);
  const groupmonth = (data: any) => {
    const groupedResults = groupBy(data, (result: any) => {
      return moment(new Date(result['date']), 'DD/MM/YYYY').startOf('month');
    });
    setDataOrder(groupedResults);
  };

  useEffect(() => {
    fetchDataOrder(true);
  }, []);

  const transformResponse = (data: any[]) => {
    return data.map((d) => {
      if (d.order) {
        return {
          date: d.created_at,
          action: d.action,
          order_no: d.order.order.name,
          product: d.order.order.line_items.map((li: any) => {
            return {
              image: '',
              vendor: li.vendor,
              title: li.title,
              variant_title: '',
              quantity: li.quantity,
              price: li.price,
            };
          }),
          total_price: d.order.order.total_price,
          reward: d.bonus_points,
        };
      } else {
        return {
          date: d.created_at,
          action: d.action,
        };
      }
    });
  };

  const fetchDataOrder = (isUpdate: any) => {
    if (isUpdate) {
      setLoading(true);
    }
    const options = {
      url: GET_TIER_HISTORY,
      method: 'GET',
      body: null,
    };
    fetchClient(options).then((res) => {
      if (res?.length) {
        groupmonth(transformResponse(res));
      }
      setLoading(false);
    });
  };

  const renderEmpty = () => {
    return (
      <div className="row">
        <div className="col-12">No order history found</div>
      </div>
    );
  };

  const renderOrders = () => {
    return (
      <>
        {Object.keys(dataOrder).length
          ? map(Object.keys(dataOrder), (key: any, index: number) => {
              return (
                <div className="wrapper-month-list" key={index}>
                  <h2>{key ? moment(key).format('MMMM YYYY') : ''}</h2>
                  <div className="table-custom-order-history" style={{ paddingBottom: '8px' }}>
                    <div className="head">
                      <div className="row col-12">
                        <div className="col-2">DATE</div>
                        <div className="col-6">ACTION</div>
                        <div className="col-2" style={{ textAlign: 'right' }}>
                          TOTAL
                        </div>
                        <div className="col-2" style={{ textAlign: 'right' }}>
                          REWARD
                        </div>
                      </div>
                    </div>
                    <div className="main">
                      <>
                        <Item data={dataOrder[key] as IRewardHistoryItem[]} />
                      </>
                    </div>
                  </div>
                </div>
              );
            })
          : renderEmpty()}
      </>
    );
  };

  return (
    <section className="mt-5 tab-OrderHistory animated faster fadeIn">
      <h1>REWARD HISTORY</h1>
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
        renderOrders()
      )}
    </section>
  );
}
export default RewardHistory;
