import React, { useState } from 'react';
import Picture from '../Picture';
import orderIc from '../../images/icons/document.svg';
import packageIc from '../../images/icons/package.svg';
import * as action from '../../redux/product/actions';
import * as actionHome from '../../redux/home/actions';
import { map } from 'lodash';
import moment from 'moment';
import { moneyFormater } from '../../redux/Helpers';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import CancelOrderModal from '../CancelOrderModal';

function Item(props: any) {
  const state = useSelector((state: RootStateOrAny) => state.productReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  // const [loadingCancel, setLoadingCancel] = useState<any>({ status: false, id: null });
  const [orderId, setOrderId] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const clickAwayHandler = () => {
    setModalOpen(false);
    setOrderId('');
  };

  const orderAgain = (item: any) => {
    const data = {
      variant_id: item?.variant_id || '',
      quantity: 1,
    };
    const index = state?.lineItems.findIndex(function (e: any) {
      return e.variant_id == data.variant_id;
    });
    const copyArr = [...state?.lineItems];

    if (index != -1) {
      const newData = {
        variant_id: data.variant_id,
        quantity: state?.lineItems[index].quantity + data.quantity,
      };
      copyArr[index] = newData;
    } else {
      copyArr.push(data);
    }
    dispatch(action.checkoutProduct(copyArr));

    dispatch(actionHome.toggleShoppingbag(true));
  };
  const directTrackingUrl = (item: any) => {
    item?.tracking_url ? window.open(item?.tracking_url, '_blank') : '';
  };
  const directPolicyPage = () => {
    history.push('/page/return-policy');
  };
  const cancelOrder = (item: any) => {
    setModalOpen(true);
    setOrderId(item?.order_id);
    // setLoadingCancel({ status: true, id: item.id });
    // const message = values.find((v) => v.id === item.order_id)?.message || '';
    // const options = {
    //   url: `${PUT_PLACE_ORDER_CHECKOUT}${item?.order_id}/cancel`,
    //   method: 'PUT',
    //   body: { message },
    // };
    // fetchClient(options).then((res) => {
    //   if (res.success) {
    //     toastrSuccess('Cancel successful');
    //     setLoadingCancel(false);
    //     props.fetchDataOrder(true);
    //   } else if (res.isError) {
    //     toastrError('Cancel fail');
    //     setLoadingCancel({ status: false, id: null });
    //     // setValidEmail(false);
    //   }
    // });
  };
  return (
    <>
      {map(props?.data, (item: any, index: number) => {
        return (
          <div key={index} className="wrapper-row-item">
            <div className="row info-extra">
              <div className="col-2">{moment(item?.created_at).format('MMM DD YYYY')}</div>
              <div className="col-4">{item?.order?.name}</div>
              <div className="col-4">
                {item?.shipping && item?.expected_date_of_receipt ? (
                  <>
                    <p>{moment(item?.expected_date_of_receipt).format('MMM DD YYYY')}</p>
                    <p className="text-store-location">
                      ({item?.cash_on_pickup ? 'Cash on pickup' : 'Paid'})
                    </p>
                  </>
                ) : (
                  <>
                    <p>Picked up in store</p>
                    {!item?.shipping && item?.cash_on_pickup ? (
                      <p className="text-store-location">(Cash on pickup)</p>
                    ) : (
                      ''
                    )}
                    {item?.store_location?.address1 ? (
                      <p className="text-store-location">({item?.store_location?.address1})</p>
                    ) : (
                      ''
                    )}
                  </>
                )}
              </div>
              <div className="col-2" style={{ textAlign: 'right' }}>
                {moneyFormater(item?.order?.current_total_price)}
              </div>
            </div>
            {map(item?.order?.line_items, (itemProduct: any, index: number) => (
              <div className="rowItem row" key={index}>
                <div className="col-md-2 col-3">
                  <div className="wrapper-img">
                    <Picture data={itemProduct?.image?.url} />
                  </div>
                </div>
                <div className="col-md-4 col-9">
                  <div className="info">
                    <h3>{itemProduct?.vendor}</h3>
                    <h4>{itemProduct?.title}</h4>
                    <div>
                      {itemProduct?.variant_title && (
                        <p>
                          <label>Size:</label> <span>{itemProduct?.variant_title}</span>
                        </p>
                      )}
                      {/* <p>
                        <label>Size:</label>{' '}
                        <span>
                          {itemProduct?.variant_title ? itemProduct?.variant_title : 'N/A'}
                        </span>
                      </p> */}
                      <p>
                        <label>Quantity:</label> <span>{itemProduct?.quantity}</span>
                      </p>
                    </div>
                    <p>
                      <label>Price:</label>{' '}
                      <span>{moneyFormater(itemProduct?.updated_price)}</span>
                    </p>
                  </div>
                </div>
                <div className="col-md-4 col-12">
                  {item?.order?.fulfillment_status == 'fulfilled' ? (
                    <div className="delevery-info">
                      <img src={packageIc} alt="" className="package-ic" />
                      <p className="status">
                        <i className="gg-check"></i> Completed
                      </p>
                    </div>
                  ) : item?.order?.fulfillment_status == 'cancelled' ? (
                    <div className="delevery-info">
                      <img src={orderIc} alt="" style={{ marginLeft: '3.3em' }} />
                      <p className="status">
                        <i className="gg-check"></i> Cancelled
                      </p>
                    </div>
                  ) : item?.order?.fulfillment_status == 'in_transit' ? (
                    <div className="delevery-info">
                      <img src={orderIc} alt="" style={{ marginLeft: '3.3em' }} />
                      <p className="status">
                        <i className="gg-check"></i> In transit
                      </p>
                    </div>
                  ) : (
                    <div className="delevery-info">
                      <img src={orderIc} alt="" />
                      <p className="status">
                        <i className="gg-check"></i> Order placed
                      </p>
                      {item?.expected_date_of_receipt ? (
                        <p>
                          You have until{' '}
                          {moment(item?.expected_date_of_receipt)
                            .utcOffset(item?.expected_date_of_receipt)
                            .format('MMM DD hh:mm a')}{' '}
                          to cancel this order
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                  )}
                </div>
                <div className="col-md-2 col-12">
                  {item?.order?.fulfillment_status == 'fulfilled' ? (
                    <div className="btn-group group-fullfiled">
                      <button
                        className="btn-primary-outline"
                        onClick={() => orderAgain(itemProduct)}
                      >
                        ORDER AGAIN
                      </button>
                      <button className="btn-policy" onClick={directPolicyPage}>
                        Return policy
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ))}
            <div className="row action-order-history">
              {item?.order?.fulfillment_status != 'cancelled' ? (
                <>
                  {/* {item?.order?.fulfillment_status == 'unfulfilled' ? (
                    <div className="cancel-message">
                      <textarea
                        value={values.find((v) => v.id === item.order_id)?.message || ''}
                        name="message"
                        onChange={(e) => onValueChange(e, item.order_id)}
                        rows={2}
                        cols={50}
                        placeholder="Add your comment here..."
                      />
                    </div>
                  ) : null} */}
                  <div className="btn-group">
                    {item?.uuid ? (
                      <a
                        target="__blank"
                        className="btn-receipt"
                        href={`/receipt/${item?.uuid}` || '/'}
                      >
                        Receipt
                      </a>
                    ) : (
                      ''
                    )}
                    {item?.shipping == true ? (
                      <button className="btn-primary" onClick={() => directTrackingUrl(item)}>
                        TRACK ORDER
                      </button>
                    ) : (
                      ''
                    )}
                    {item?.order?.fulfillment_status == 'unfulfilled' ? (
                      <button
                        className="btn-primary-outline"
                        onClick={() => cancelOrder(item)}
                        // style={{ cursor: loadingCancel.status ? 'not-allowed' : '' }}
                      >
                        CANCEL ORDER
                        {/* {loadingCancel.status && item?.id == loadingCancel?.id ? (
                          <div
                            className="lds-roller"
                            style={{ transform: 'scale(0.3)', bottom: '16px' }}
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
                      </button>
                    ) : (
                      ''
                    )}
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        );
      })}
      <CancelOrderModal
        isOpen={modalOpen}
        orderId={orderId}
        onClickAway={clickAwayHandler}
        fetchDataOrder={props.fetchDataOrder}
      />
    </>
  );
}
export default Item;
