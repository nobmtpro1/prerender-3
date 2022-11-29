import React from 'react';
import { moneyFormater } from '../../redux/Helpers';

function VoucherSelector({
  data,
  voucherId,
  hasDiscountCode,
  removeVoucher,
  addVoucher,
}: {
  data: any;
  voucherId: number;
  hasDiscountCode: boolean;
  removeVoucher: (data: any) => any;
  addVoucher: (i: any) => any;
}) {
  const { id, value, visible, price_for_voucher, minimum_purchase_amount } = data;

  const handleClick = () => {
    // const value = e.target.value;
    // console.log(e.target);
    // console.log('Clicked', id === voucherId);
    if (id === voucherId) removeVoucher(data);
  };

  const handleChange = () => {
    // const checkVoucher = visible ? true : false;
    // if (voucherId === id) {
    //   removeVoucher();
    // } else if (checkVoucher) {
    if (hasDiscountCode) {
      removeVoucher(data);
    } else {
      addVoucher(data);
    }
    // }
  };
  return (
    <label className="radio-voucher">
      <input
        type="radio"
        disabled={!visible ? true : false}
        checked={id === voucherId ? true : false}
        onChange={handleChange}
        onClick={handleClick}
      />
      <div className={`radio-label payment-ic ${!visible ? 'disabled' : ''}`}>
        {moneyFormater(value)} ({price_for_voucher} points) &nbsp;
        <div>
          {!visible
            ? `Required purchase minimum ${moneyFormater(minimum_purchase_amount)}`
            : ''}
        </div>
      </div>
    </label>
  );
}

export default VoucherSelector;
