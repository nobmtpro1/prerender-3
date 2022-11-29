import { map } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import * as action from '../../redux/home/actions';

function BagIcon() {
  const [invisibleBadge, setInvisibleBadge] = useState<boolean>(false);
  const dispatch = useDispatch();
  const state = useSelector((state: RootStateOrAny) => state.productReducer);
  const [modal, setModal] = useState<any>(true);
  useEffect(() => {
    if (
      state?.product &&
      state?.product?.line_items &&
      state?.product?.line_items?.length > 0
    ) {
      setInvisibleBadge(true);
    } else {
      setInvisibleBadge(false);
    }
  }, [state.product, state.lineItems.length]);
  const handleOpenShoppingBag = () => {
    let overflow = 'hidden';
    dispatch(action.toggleShoppingbag(modal));
    if (!modal) {
      overflow = '';
    }
    document.body.style.overflow = overflow;
    setModal(!modal);
  };
  let totalQuantity = 0;
  state?.product?.line_items
    ? map(state?.product?.line_items, (i) => {
        totalQuantity = totalQuantity + i.quantity;
      })
    : '';
  return (
    <div className="icon-bag">
      <button onClick={handleOpenShoppingBag}>
        <i className="gg-color-bucket"></i>
        <span className={`badge ${invisibleBadge ? '' : 'invisible-badge'}`}>
          {state?.product && state?.product?.line_items?.length > 0 ? totalQuantity : ''}
        </span>
      </button>
    </div>
  );
}
export default BagIcon;
