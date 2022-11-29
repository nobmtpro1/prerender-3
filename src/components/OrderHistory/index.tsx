import React, { useEffect, useState } from 'react';
import './order-history.scss';
import Item from './Item';
import { map, groupBy } from 'lodash';
import moment from 'moment';
import { GET_ORDER_HISTORY } from '../../config';
import { fetchClient } from '../../redux/Helpers';

function OrderHistory() {
  const [dataOrder, setDataOrder] = useState<any>({});
  const [loading, setLoading] = useState<any>(false);
  const groupmonth = (data: any) => {
    const groupedResults = groupBy(data.data, (result: any) => {
      return moment(new Date(result['created_at']), 'DD/MM/YYYY').startOf('month');
    });
    setDataOrder(groupedResults);
  };

  useEffect(() => {
    fetchDataOrder(true);
  }, []);

  const fetchDataOrder = (isUpdate: any) => {
    if (isUpdate) {
      setLoading(true);
    }
    const options = {
      url: GET_ORDER_HISTORY,
      method: 'GET',
      body: null,
    };
    fetchClient(options).then((res) => {
      if (res.success) {
        groupmonth(res);
        setLoading(false);
      }
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
                      <div className="row">
                        <div className="col-2">Order Placed</div>
                        <div className="col-4">Order#</div>
                        <div className="col-4">Est delivery date</div>
                        <div className="col-2" style={{ textAlign: 'right' }}>
                          total
                        </div>
                      </div>
                    </div>
                    <div className="main">
                      <Item data={dataOrder[key]} fetchDataOrder={fetchDataOrder} />
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
    <section className="tab-OrderHistory animated faster fadeIn">
      <h1>ORDER HISTORY</h1>
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
export default OrderHistory;
