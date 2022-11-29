import React, { useState } from 'react';
import { PUT_PLACE_ORDER_CHECKOUT } from '../../config';
import { isMobile } from '../../DetectScreen';
import { fetchClient, toastrSuccess, toastrError } from '../../redux/Helpers';
import BlockModal from '../BlockModal';

function CancelOrderModal({
  orderId,
  isOpen,
  onClickAway,
  onKeyPress,
  fetchDataOrder,
}: {
  orderId: string;
  isOpen: boolean;
  fetchDataOrder: any;
  onKeyPress?: any;
  onClickAway?: any;
}): JSX.Element {
  const [value, setValue] = useState<string>('');

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.currentTarget.value;
    if (e instanceof HTMLTextAreaElement) value = e.currentTarget.innerText;
    setValue(value);
  };

  const clickAwayHandler = () => {
    setValue('');
    onClickAway();
  };

  const cancelOrder = () => {
    if (orderId?.length) {
      const options = {
        url: `${PUT_PLACE_ORDER_CHECKOUT}${orderId}/cancel`,
        method: 'PUT',
        body: { message: value },
      };
      // console.log(options);
      fetchClient(options).then((res) => {
        if (res.success) {
          toastrSuccess('Cancel successful');
          fetchDataOrder(true);
          onClickAway();
        } else if (res.isError) {
          toastrError('Cancel fail');
          onClickAway();
        }
      });
    }
  };

  return (
    <BlockModal
      isOpen={isOpen}
      minWidth={isMobile ? '70%' : '36%'}
      maskBg={true}
      onKeyPress={onKeyPress}
      onClickAway={onClickAway}
    >
      <div className="cancel-order">
        <textarea
          className="comment"
          value={value}
          name="message"
          onChange={(e) => onValueChange(e)}
          rows={8}
          placeholder=" Cancelling order? Tell us why (Optional)"
        />
        <div className="cancel-order-action btn-group">
          <button className="cancel btn-primary-outline" onClick={cancelOrder}>
            CANCEL ORDER
          </button>
          <button className="back btn-primary" onClick={clickAwayHandler}>
            GO BACK
          </button>
        </div>
      </div>
    </BlockModal>
  );
}

export default CancelOrderModal;
