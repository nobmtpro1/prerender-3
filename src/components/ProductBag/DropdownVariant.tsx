import { filter } from 'lodash';
import React, { memo, useState } from 'react';
import Select from 'react-dropdown-select';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import { moneyFormater } from '../../redux/Helpers';
import * as action from '../../redux/product/actions';

function DropdownVariant(props: any) {
  const [variant, setvariant] = useState<any>(
    filter(props.data, (x) => x.variant_id == props.variantID) || [],
  );

  const dispatch = useDispatch();
  const state = useSelector((state: RootStateOrAny) => state.productReducer);

  const handleChangeVariant = (value: any, variantID: any) => {
    setvariant(value);
    const data = {
      variant_id: value[0].variant_id,
      quantity: 1,
    };
    const oldProductIndex = state?.lineItems.findIndex(function (e: any) {
      return e.variant_id == variantID;
    });

    const copyArr = [...state?.lineItems];
    if (oldProductIndex !== -1) {
      copyArr[oldProductIndex] = data;
    }

    dispatch(action.checkoutProduct(copyArr));
  };

  return (
    <section className="empty-bag">
      <Select
        placeholder="Select"
        className="primary-select variant-select"
        searchable={false}
        itemRenderer={({ item, methods }: { item: any; methods: any }) => {
          return (
            <div
              onClick={() => (!item?.disabled ? methods.addItem(item) : '')}
              className={`custom-item ${methods.isSelected(item) ? 'selected' : ''} ${
                item?.disabled ? 'disabled' : ''
              }`}
            >
              <span>{item.title}</span>
              <span>{item.price ? moneyFormater(item.price) : ''}</span>
            </div>
          );
        }}
        labelField="title"
        onChange={(value: any) =>
          !value[0].disabled ? handleChangeVariant(value, props.variantID) : ''
        }
        valueField="variant_id"
        options={props.data}
        values={variant}
      />
    </section>
  );
}
export default memo(DropdownVariant);
