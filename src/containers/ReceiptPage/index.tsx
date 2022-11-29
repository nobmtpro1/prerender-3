import { isEmpty, reduce, map } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import logo from '../../images/icons/sundora-logo-vertical.png';
import './styles.scss';
import { GET_ORDER_HISTORY } from '../../config';
import { fetchClient, moneyFormater } from '../../redux/Helpers';
import moment from 'moment';

function ReceiptPage(): JSX.Element {
  const [data, setData] = useState<any>(null);
  const { id } = useParams<any>();
  const fetchDataInit = async () => {
    if (isEmpty(data)) {
      const options = {
        url: `${GET_ORDER_HISTORY}${id}/`,
        method: 'GET',
        body: null,
      };
      // this.props.loadingPage(true);
      const pending = [fetchClient(options)];
      try {
        const results = await Promise.all(pending);
        const data = results[0];
        setData(data?.data);
        window.addEventListener('afterprint', () => {
          window.close();
        });
        window.print();
        // console.log(data.data);
      } catch (error) {
        // toastrError(error.message);
        // this.props.loadingPage(false);
      }
    }
  };

  useEffect(() => {
    fetchDataInit();
  }, []);
  const totalQuantity = reduce(
    data?.order?.line_items,
    (accumulator: any, currentValue: any) => accumulator + currentValue.quantity,
    0,
  );
  // console.log(data);
  return (
    <section className="receipt">
      <div className="header-receipt">
        <img className="py-2" src={logo} width="150" alt="logo-sundora" />
        <p>Sundora</p>
        <p>Banani 2 Outlet</p>
        <p>House No #38, Road No#12, Block E, Banani-1212</p>
        <p>01979793041</p>
        <p>www.sundora.com.bd</p>
        <p>BIN-002884759-0101</p>
        <p>Musak 6.3</p>
        {/* <p>VAT REG. No. : 002884759-0101</p> */}
      </div>
      <div className="inf-receipt">
        <p>
          {data?.order && data?.order?.created_at
            ? moment(data?.order?.created_at)
                .utcOffset(data?.order?.created_at)
                .format('DD-MM-yyyy hh:mm a')
            : '-'}
        </p>
      </div>
      <div className="inf-customer">
        <p>Order ID: #6{data?.order?.order_number}</p>
        <p>
          Customer: {data?.user?.first_name} {data?.user?.last_name}
        </p>
        <p>Company Name: {data?.company_name != null ? data?.company_name : '-'}</p>
        <p>Phone Number: {data?.user?.phone || '-'}</p>
        <p>E-Mail: {data?.user?.email || '-'}</p>
      </div>
      <div className="item-list">
        {/* <p className="title">Item Name</p> */}
        <div className="table">
          <table>
            <tbody>
              <tr className="tabletitle">
                <td className="title">
                  <p>Product ID / Item Name</p>
                </td>
                <td className="Hours text-right">
                  <p>Qty.</p>
                </td>
                <td className="item">
                  <p>Price</p>
                </td>
                <td className="Disc text-right">
                  <p>Discount</p>
                </td>
                <td className="Rate text-right">
                  <p>Total</p>
                </td>
              </tr>

              {map(data?.order?.line_items, (item: any, index: any) => (
                <tr className="service" key={index}>
                  <td className="tableitem nameProduct">
                    <p className="itemtex">
                      <span>{item?.sku} / </span>
                      <span>{item?.name}</span>
                    </p>
                  </td>
                  <td className="tableitem">
                    <p className="itemtext text-right">{item?.quantity}</p>
                  </td>
                  <td className="tableitem">
                    <p className="price">{item?.price ? moneyFormater(item?.price) : ''}</p>
                  </td>
                  <td className="tableitem">
                    <p className="itemtext text-right">
                      {item?.total_discount ? '-' + moneyFormater(item?.total_discount) : ''}
                    </p>
                  </td>
                  <td className="tableitem">
                    <p className="itemtext text-right">
                      {item?.price
                        ? moneyFormater(item?.price * item?.quantity - item?.total_discount)
                        : ''}
                    </p>
                  </td>
                </tr>
              ))}

              <tr className="tabletitle foot">
                <td style={{ paddingTop: 16 }}></td>
                <td style={{ paddingTop: 16 }}></td>
                <td style={{ paddingTop: 16 }}></td>
                <td className="Rate" style={{ paddingTop: 16 }}>
                  <p className="text-right">Sub Total</p>
                </td>
                <td className="payment" style={{ paddingTop: 16 }}>
                  <p className="text-right">
                    {data?.order?.subtotal_without_discount
                      ? moneyFormater(data?.order?.subtotal_without_discount)
                      : ''}
                  </p>
                </td>
              </tr>

              {data?.order?.current_total_discounts ? (
                <tr className="tabletitle foot">
                  <td style={{ paddingTop: 16 }}></td>
                  <td style={{ paddingTop: 16 }}></td>
                  <td style={{ paddingTop: 16 }}></td>
                  {data?.order?.discount_codes?.length ? (
                    <td className="Rate" style={{ paddingTop: 16 }}>
                      <p className="text-right">Discount:</p>
                    </td>
                  ) : (
                    <td style={{ paddingTop: 16 }}></td>
                  )}
                  <td className="payment" style={{ paddingTop: 16 }}>
                    <p className="text-right">
                      {data?.order?.discount_codes?.length
                        ? '- ' + moneyFormater(data?.order?.discount_codes[0].amount)
                        : ''}
                    </p>
                  </td>
                </tr>
              ) : null}

              <tr className="tabletitle foot">
                <td></td>
                <td></td>
                <td></td>
                {/* <td className="Rate">
                  <p className="text-right">Price discounted</p>
                </td> */}
                {/* <td className="payment">
                  <p className="text-right">
                    <span style={{ fontWeight: 'bold' }}>-</span>
                    {data?.order?.total_discounts
                      ? moneyFormater(data?.order?.total_discounts)
                      : ''}
                  </p>
                </td> */}
              </tr>

              <tr className="tabletitle foot">
                <td></td>
                <td></td>
                <td></td>
                <td className="Rate">
                  <p className="text-right">
                    VAT (5%)
                    {/* {data?.order?.tax_lines && data?.order?.tax_lines.length > 0
                      ? data?.order?.tax_lines[0].rate * 100 + '%'
                      : ''} */}
                  </p>
                </td>
                <td className="payment">
                  <p className="text-right">
                    {data?.order?.total_tax ? moneyFormater(data?.order?.total_tax) : ''}
                  </p>
                </td>
              </tr>

              <tr className="tabletitle foot">
                <td></td>
                <td></td>
                <td></td>
                <td className="Rate">
                  <p className="text-right">SHIPPING FEE</p>
                </td>
                <td className="payment">
                  <p className="text-right">
                    {data?.order?.total_shipping &&
                    parseFloat(data?.order?.total_shipping) > 0 ? (
                      <span>{moneyFormater(data?.order?.total_shipping)}</span>
                    ) : (
                      <span className="free-shipping">FREE</span>
                    )}
                  </p>
                </td>
              </tr>

              <tr className="tabletitle foot">
                <td></td>
                <td></td>
                <td></td>
                <td className="Rate">
                  <p className="text-right">Total</p>
                </td>
                <td className="payment">
                  <p className="text-right">
                    {data?.order?.current_total_price
                      ? moneyFormater(data?.order?.current_total_price)
                      : ''}
                  </p>
                </td>
              </tr>
              <tr className="tabletitle foot">
                <td></td>
                <td></td>
                <td></td>
                <td className="Rate">
                  <p className="text-right">Number of items sold</p>
                </td>
                <td className="payment">
                  <p className="text-right">{totalQuantity ? totalQuantity : ''}</p>
                </td>
              </tr>
              <tr className="tabletitle foot">
                <td></td>
                <td></td>
                <td></td>
                <td className="Rate">
                  <p className="text-right">Cash</p>
                </td>
                <td className="payment">
                  <p className="text-right">-</p>
                </td>
              </tr>
              <tr className="tabletitle foot">
                <td></td>
                <td></td>
                <td></td>
                <td className="Rate">
                  <p className="text-right">MTB</p>
                </td>
                <td className="payment">
                  <p className="text-right">-</p>
                </td>
              </tr>
              <tr className="tabletitle foot">
                <td></td>
                <td></td>
                <td></td>
                <td className="Rate">
                  <p className="text-right">Change Amount</p>
                </td>
                <td className="payment">
                  <p className="text-right">-</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="inf-foot">
        <p>
          If you are not completely satisfied with your Sundora purchases. you may return the
          merchandise with your receipt and the original form of payment. We will be glad to
          credit you in the same form of payment with which your purchase was made when you
          return your item within 7 days of the purchase date. <br /> <br /> Sundora shall not
          accept returns without a receipt or where the product has been opened/damaged in any
          way.
        </p>
      </div>
    </section>
  );
}
export default ReceiptPage;
