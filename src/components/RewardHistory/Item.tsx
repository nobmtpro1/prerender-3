import React from 'react';
import Picture from '../Picture';
import { map } from 'lodash';
import moment from 'moment';
import { moneyFormater } from '../../redux/Helpers';

export interface IRewardHistoryItem {
  date: string;
  action: string;
  order_no: string;
  product: {
    image: string;
    title: string;
    quantity: number;
    variant_title: any;
    price: string;
  }[];
  total_price: string;
  reward: number;
}

function Item({ data }: { data: IRewardHistoryItem[] }) {
  return (
    <>
      {data.map((d, index) => (
        <div key={index} className="wrapper-row-item">
          <div className="row info-extra align-items-center">
            <div className="col-2">{moment(d.date).format('MMM DD YYYY')}</div>
            <div className="col-6">{`${d.action.toUpperCase()} - ORDER ${
              d.order_no || ''
            }`}</div>
            <div className="col-2" style={{ textAlign: 'right' }}>
              {moneyFormater(d.total_price)}
            </div>
            <div className="col-2" style={{ textAlign: 'right' }}>
              +{d.reward}
            </div>
          </div>
          {d.product &&
            map(d.product, (itemProduct: any, index: number) => (
              <div className="rowItem row col-12" key={index}>
                <div className="col-md-2 col-3">
                  <div className="wrapper-img">
                    <Picture data={itemProduct.image} />
                  </div>
                </div>
                <div className="col-md-6 col-9">
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
                      <label>Price:</label> <span>{moneyFormater(itemProduct?.price)}</span>
                    </p>
                  </div>
                </div>
                <div className="col-md-2 col-9 offset-3 offset-md-0">
                  <span>{`${moneyFormater(itemProduct?.price)} X ${
                    itemProduct?.quantity
                  }`}</span>
                </div>
              </div>
            ))}
        </div>
      ))}
    </>
  );
}
export default Item;
