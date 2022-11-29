import React, { memo, useEffect, useState } from 'react';
import * as actionProduct from '../../redux/product/actions';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux';
import { addProductToCart, removeProductFromCart } from '../../utils/helpers/productTracker';
import { MAXIMUM_QUANTITY_ADDING_TO_CART, PHONE_CONTACT } from '../../config';
import { toastrWarning } from '../../redux/Helpers';

function Quantity(props: any): JSX.Element {
  const state = useSelector((state: RootStateOrAny) => state.productReducer);
  const [value, setValue] = useState<any>(props.quantity ? props.quantity : 1);
  const dispatch = useDispatch();
  const decrement = () => {
    handleChangeQuantityProduct(value - 1, 'decrement');
  };
  const increment = () => {
    if (value >= MAXIMUM_QUANTITY_ADDING_TO_CART) {
      toastrWarning(`For bigger purchase, please contact ${PHONE_CONTACT}`);
      return false;
    }
    handleChangeQuantityProduct(value + 1, 'increment');
  };

  useEffect(() => {
    setValue(props.quantity);
  }, [state]);

  const handleChangeQuantityProduct = (num: any, type: any) => {
    const copyArr = [...state?.lineItems];
    const data = {
      variant_id: props?.variantId,
      quantity: num,
    };
    const index = copyArr.findIndex(function (e) {
      return e.variant_id == data.variant_id;
    });

    if (type == 'decrement') {
      removeProductFromCart(props.variant);
    } else {
      addProductToCart(props.variant);
    }

    index != -1 ? (copyArr[index] = data) : copyArr.push(data);
    dispatch(actionProduct.checkoutProduct(copyArr));
  };

  return (
    <section className="quantity-box">
      <button
        onClick={decrement}
        disabled={value <= 1}
        className={`${props.isDisabled ? 'd-none' : ''}`}
      >
        &mdash;
      </button>
      <input type="text" value={value} readOnly />
      <button onClick={increment} className={`${props.isDisabled ? 'd-none' : ''}`}>
        &#xff0b;
      </button>
    </section>
  );
}
export default memo(Quantity);
