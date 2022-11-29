import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import { isTablet } from '../../DetectScreen';
import Picture from '../Picture';
import starSolidIcon from '../../images/icons/star-solid.svg';
import starIcon from '../../images/icons/star-regular.svg';
import starHaftIcon from '../../images/icons/star-half-solid.svg';
import iconMale from '../../images/icons/collection-male.svg';
import iconFemale from '../../images/icons/collection-female.svg';
import iconUnisex from '../../images/icons/collection-unisex.svg';
import wishListIcon from '../../images/icons/wishlist-solid.svg';
import olfactoryIcon from '../../images/icons/sundora-icons.svg';
import wishListActiveIcon from '../../images/icons/wishlist-gold-regular.svg';
import addIcon from '../../images/icons/addToCart-white.svg';
import { fetchClient, moneyFormater, toastrWarning } from '../../redux/Helpers';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import * as action from '../../redux/product/actions';
import * as actionHome from '../../redux/home/actions';
import {
  GET_WISHLIST,
  MAXIMUM_QUANTITY_ADDING_TO_CART,
  PERFUME_TYPE_MAP,
  PERFUME_TYPE_TAGS,
  PHONE_CONTACT,
} from '../../config';
import { filter, find, isEmpty, map, sumBy } from 'lodash';
import { addProductToCart } from '../../utils/helpers/productTracker';
import { useHistory } from 'react-router';
import Select from 'react-dropdown-select';
import { Collapse } from 'react-collapse';

function ProductDetailModal({
  handleOpenModalNote,
  handleModalClose,
  handleOutStockProduct,
  data,
  inventory,
  defaultVariant,
  isWishListChecked,
}: {
  handleOpenModalNote: any;
  handleModalClose: any;
  handleOutStockProduct: any;
  data: any;
  inventory: any;
  defaultVariant: any;
  isWishListChecked: boolean;
}): JSX.Element {
  const [checkOutValue, setCheckOutValue] = useState<any>({ variant_id: null, quantity: 1 });
  const [price, setPrice] = useState<any>();
  const [discountedPrice, setDiscountedPrice] = useState<any>();
  const state = useSelector((state: RootStateOrAny) => state.productReducer);
  const [isWishList, setIsWishList] = useState<any>(null);
  const [dataGender, setDataGender] = useState<any>({});
  const [inventoryVariant, setInventoryVariant] = useState<any>({});
  const [tagsCollapse, setTagsCollapse] = useState<any>({});
  const [tags, setTags] = useState<any>([]);
  const dispatch = useDispatch();
  const history = useHistory();

  const calculatePriceDiscount = (value: any, discountValue: any) => {
    return (parseFloat(value) * (100 - parseFloat(discountValue || 0))) / 100;
  };

  const handleChangeVariant = (value: any) => {
    setCheckOutValue({ ...value, quantity: 1 });
    setPrice(value?.price);
    setDiscountedPrice(calculatePriceDiscount(value?.price, value?.discount));
  };

  const getPerfumeType = (tags: string[]): string => {
    for (let i = 0; i < tags.length; i++) {
      if (PERFUME_TYPE_TAGS.includes(tags[i].toLowerCase()))
        return PERFUME_TYPE_MAP[tags[i].toLowerCase()];
    }
    return '';
  };

  useEffect(() => {
    // Gender icon
    const unisex = find(data?.collections, (i: any) => i.handle == 'unisex');
    if (unisex) {
      setDataGender(unisex);
    } else {
      const gender = find(
        data?.collections,
        (i: any) => i.handle == 'man' || i.handle == 'woman',
      );
      setDataGender(gender);
    }

    //Merge similar tags
    if (data?.translated_tags) {
      setTags(mergeSimilarTranslatedTags(data.translated_tags));
    }
  }, [data]);
  useEffect(() => {
    setCheckOutValue({ ...defaultVariant, quantity: 1 });
    if (defaultVariant?.price) {
      setPrice(defaultVariant?.price);
      if (defaultVariant?.discount) {
        setDiscountedPrice(
          calculatePriceDiscount(defaultVariant?.price, defaultVariant?.discount),
        );
      }
    }
    setIsWishList(null);
  }, [defaultVariant]);

  useEffect(() => {
    const invenVariant = find(
      inventory,
      (i: any) => i.variant_id == checkOutValue?.variant_id,
    );
    setInventoryVariant(invenVariant);
  }, [inventory, checkOutValue]);

  const handleCheckoutProduct = (e: any) => {
    e.stopPropagation();
    if (!handleInventory('checkout')) {
      return;
    }
    const index = state?.lineItems.findIndex(function (e: any) {
      return e.variant_id == checkOutValue.variant_id;
    });
    const copyArr = [...state?.lineItems];

    let quantity = checkOutValue?.quantity;
    if (index != -1) {
      quantity = state?.lineItems[index].quantity + checkOutValue.quantity;
      const newData = {
        variant_id: checkOutValue.variant_id,
        quantity: quantity,
      };
      copyArr[index] = newData;
    } else {
      copyArr.push(checkOutValue);
    }

    addProductToCart({
      ...data,
      variant_id: checkOutValue?.variant_id,
      price: checkOutValue?.price,
      title: checkOutValue?.title,
      quantity: quantity,
    });

    dispatch(action.checkoutProduct(copyArr));

    dispatch(actionHome.toggleShoppingbag(true));

    handleModalClose();
  };

  const decrement = () => {
    setCheckOutValue({ ...checkOutValue, quantity: checkOutValue.quantity - 1 });
    setPrice(parseFloat(checkOutValue?.price) * (checkOutValue?.quantity - 1));
    setDiscountedPrice(
      calculatePriceDiscount(
        parseFloat(checkOutValue.price) * (checkOutValue.quantity - 1),
        checkOutValue?.discount,
      ),
    );
  };
  const increment = () => {
    if (!handleInventory('increment')) {
      return;
    }
    setCheckOutValue({ ...checkOutValue, quantity: checkOutValue.quantity + 1 });
    setPrice(parseFloat(checkOutValue.price) * (checkOutValue.quantity + 1));
    setDiscountedPrice(
      calculatePriceDiscount(
        parseFloat(checkOutValue.price) * (checkOutValue.quantity + 1),
        checkOutValue?.discount,
      ),
    );
  };

  const handleInventory = (type: string) => {
    if (inventoryVariant?.inventory_quantity <= 0) {
      handleOutStockProduct();
      return false;
    }

    const titleVariant = find(
      data?.product_variants,
      (i: any) => i.variant_id == inventoryVariant.variant_id,
    )?.title;
    const title = `${data.name} ${titleVariant != 'Default Title' ? `- ${titleVariant}` : ''}`;

    if (
      type == 'increment' &&
      checkOutValue.quantity + 1 > inventoryVariant.inventory_quantity
    ) {
      toastrWarning(`${title} only ${inventoryVariant.inventory_quantity} products left`);
      return false;
    }
    if (type == 'increment' && checkOutValue.quantity == MAXIMUM_QUANTITY_ADDING_TO_CART) {
      toastrWarning(`For bigger purchase, please contact ${PHONE_CONTACT}`);
      return false;
    }
    return true;
  };

  const dataFilterOlScent = filter(data.scents, (item: any) => item.type == 'olfactory');

  const handleOpenModal = (data: any) => {
    handleOpenModalNote(data);
  };

  const handleAddToWishList = () => {
    if (isWishList == null) {
      if (isWishListChecked) {
        const options = {
          url: `${GET_WISHLIST}/`,
          method: 'DELETE',
          body: {
            product_id: data?.id || null,
          },
        };
        fetchClient(options).then((res) => {
          if (res.success) {
            setIsWishList(false);
          }
        });
      } else {
        const options = {
          url: `${GET_WISHLIST}/`,
          method: 'POST',
          body: {
            product_id: data?.id || null,
          },
        };
        fetchClient(options).then((res) => {
          if (res.success) {
            setIsWishList(true);
          }
        });
      }
    } else if (isWishList == false) {
      const options = {
        url: `${GET_WISHLIST}/`,
        method: 'POST',
        body: {
          product_id: data?.id || null,
        },
      };
      fetchClient(options).then((res) => {
        if (res.success) {
          setIsWishList(true);
        }
      });
    } else {
      const options = {
        url: `${GET_WISHLIST}/`,
        method: 'DELETE',
        body: {
          product_id: data?.id || null,
        },
      };
      fetchClient(options).then((res) => {
        if (res.success) {
          setIsWishList(false);
        }
      });
    }
  };

  const directDetailProduct = (handle: any, brandName: any) => {
    history.push('/brand/' + brandName + '/' + handle);
  };

  const sum = sumBy(data?.reviews, (item: any) => item.star);
  const avg = Number(
    data?.reviews && sum ? (Math.round((sum / data?.reviews.length) * 2) / 2).toFixed(1) : 0,
  );

  const setItemTagsCollapse = (tagId: any) => {
    const item: any = {};
    item[tagId] = !tagsCollapse[tagId];
    setTagsCollapse({ ...tagsCollapse, ...item });
  };

  const mergeSimilarTranslatedTags = (
    translateTags: Array<{ id: number; key: string; value: string }>,
  ): Array<{ id: number; key: string; value: string }> => {
    const returnedTags: Array<{ id: number; key: string; value: string }> = [];
    translateTags.forEach((item) => {
      const foundTag = returnedTags.findIndex((tag) => tag.key === item.key);
      if (foundTag >= 0) {
        returnedTags[foundTag].value = returnedTags[foundTag].value + ',' + item.value;
      } else {
        returnedTags.push(item);
      }
    });
    return returnedTags;
  };

  return data ? (
    <section className="blk-product-detail-modal">
      <section className="row">
        <div className="col-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-close" type="button" onClick={handleModalClose}></button>
        </div>
        {data?.images ? (
          <div className="col-md-6 col-12 img-favorite-box">
            <div className="favorite-box">
              <div></div>
              <span
                className="sale-inf"
                style={{
                  visibility: checkOutValue?.discount > 0 ? 'visible' : 'hidden',
                }}
              >
                {checkOutValue?.discount > 0 ? `-${checkOutValue?.discount}%` : ''}
              </span>
            </div>
            {data?.images && data?.images.length > 0 ? (
              <div className="product-img">
                <Picture data={data.images[0].url} />
                <link itemProp="image" href={data.images[0]?.url?.original} />
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
        <div className="col-md-6 col-12">
          {data?.product_variants ? (
            <section className="detail-product">
              <div>
                <div className="head">
                  <div className="block-name">
                    {data?.brand?.name ? (
                      <h3 className="brand-name">{data?.brand?.name}</h3>
                    ) : (
                      ''
                    )}
                    <h1 className="product-name">{data?.name}</h1>
                    <h1 className="product-type">
                      {data?.tags?.length ? getPerfumeType(data?.tags) : ''}
                    </h1>
                    <meta itemProp="name" content={data?.name} />
                  </div>
                  <div className="box-gender">
                    <img
                      src={
                        dataGender?.handle == 'man'
                          ? iconMale
                          : dataGender?.handle == 'woman'
                          ? iconFemale
                          : iconUnisex
                      }
                      alt="ic-male"
                      width={35}
                      height={35}
                    />
                  </div>
                </div>
                <div className="box-evaluate-wishlist">
                  <div className="evaluate-box">
                    <ul>
                      {map([1, 2, 3, 4, 5], (star: any, index: any) => {
                        return avg % 1 != 0.5 ? (
                          <li key={index}>
                            <span className="star-icon">
                              {avg < star ? (
                                <img src={starIcon} alt="" />
                              ) : (
                                <img src={starSolidIcon} alt="" />
                              )}
                            </span>
                          </li>
                        ) : (
                          <li>
                            <span className="star-icon" key={index}>
                              {(avg - star) % 1 == 0.5 ? (
                                <img src={starSolidIcon} alt="" />
                              ) : avg + 0.5 < star ? (
                                <img src={starIcon} alt="" />
                              ) : (
                                <img src={starHaftIcon} alt="" />
                              )}
                            </span>
                          </li>
                        );
                      })}
                      <li>
                        <p className="text-avg">
                          {avg} ({data?.reviews.length})
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="d-flex align-items-center box-wishlist">
                    <button
                      className={`btn-add-wish ${
                        isWishList == null
                          ? isWishListChecked
                            ? 'wish-list'
                            : ''
                          : isWishList
                          ? 'wish-list'
                          : ''
                      } `}
                      onClick={handleAddToWishList}
                    >
                      <span>
                        {isWishList == null
                          ? isWishListChecked
                            ? 'Added'
                            : 'Add'
                          : isWishList
                          ? 'Added'
                          : 'Add'}{' '}
                        to WishList
                      </span>
                      {isWishList == null ? (
                        isWishListChecked ? (
                          <img src={wishListActiveIcon} className="ic-wishlist" />
                        ) : (
                          <img src={wishListIcon} className="ic-wishlist" />
                        )
                      ) : isWishList ? (
                        <img src={wishListActiveIcon} className="ic-wishlist" />
                      ) : (
                        <img src={wishListIcon} className="ic-wishlist" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="main">
                <ul className="scent-group-box">
                  {dataFilterOlScent.length > 0 ? (
                    <li>
                      <div className="wrapper-img">
                        <img src={olfactoryIcon} alt="" />
                      </div>
                      <div className="scent-note">
                        <h4>SCENT FAMILY</h4>
                        {map(dataFilterOlScent, (item: any, index: any) => (
                          <button key={index} onClick={() => handleOpenModal(item)}>
                            {item.name}
                          </button>
                        ))}{' '}
                      </div>
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
                {/* {data?.translated_tags && data?.translated_tags.length > 0 ? (
                  <div className="tag-translated-box">
                    <ul>
                      {map(data?.translated_tags, (item: any, index: any) => (
                        <li key={index}>
                          <p>
                            <span className="title">{item.key}</span>: {item.value}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  ''
                )} */}
                {/* Tags translation collapse */}
                {map(tags, (item: any, index: any) => (
                  <div key={index} className="box-collapse">
                    <div
                      className="box-collapse__navigate"
                      onClick={() => setItemTagsCollapse(item.id)}
                    >
                      <p className="box-collapse__navigate__text-title">{item.key}</p>
                      {!isEmpty(tagsCollapse) && tagsCollapse[item.id] ? (
                        <span className="material-icons">expand_less</span>
                      ) : (
                        <span className="material-icons">keyboard_arrow_down</span>
                      )}
                    </div>
                    <Collapse
                      isOpened={!isEmpty(tagsCollapse) ? tagsCollapse[item.id] : false}
                    >
                      <p className="tag-description">{item.value}</p>
                    </Collapse>
                  </div>
                ))}
              </div>
              {/* {!isTablet ? ( */}
              <div className="quantity-price-bag">
                <div className="size-quantity-group">
                  {data?.product_variants &&
                  data?.product_variants[0]?.title == 'Default Title' ? (
                    ''
                  ) : (
                    <div className="size-box">
                      <p>
                        {data?.product_options
                          ?.slice(0)
                          ?.reverse()
                          ?.map((e: any, i: any) => (
                            <span key={i}>
                              {i == 0 ? '' : ' / '}
                              {e?.name?.toUpperCase()}
                            </span>
                          ))}
                      </p>
                      {data?.product_variants && data?.product_variants?.length > 1 ? (
                        <>
                          <Select
                            placeholder="Select"
                            className="primary-select variant-select"
                            searchable={false}
                            multi={false}
                            itemRenderer={({ item, methods }: { item: any; methods: any }) => (
                              <div
                                onClick={() => (!item?.disabled ? methods.addItem(item) : '')}
                                className={`custom-item ${
                                  methods.isSelected(item) ? 'selected' : ''
                                } ${item?.disabled ? 'disabled' : ''}`}
                              >
                                <span>
                                  {item.title} {item?.discount > 0 && `(-${item?.discount}%)`}
                                </span>
                              </div>
                            )}
                            labelField="title"
                            onChange={(value: any) => {
                              handleChangeVariant(value[0]);
                            }}
                            valueField="variant_id"
                            options={data?.product_variants}
                            values={[
                              data?.product_variants && data?.product_variants?.length > 0
                                ? data?.product_variants[0]
                                : {},
                            ]}
                          />
                          <p className="variant-option-count">{`${data?.product_variants?.length} options available`}</p>
                        </>
                      ) : (
                        <div className="size">{data?.product_variants[0]?.title}</div>
                      )}
                    </div>
                  )}
                  <div className="quantity-price-group">
                    <div>
                      <p>Quantity</p>
                      <section className="quantity-box">
                        <button onClick={decrement} disabled={checkOutValue.quantity <= 1}>
                          &mdash;
                        </button>
                        <input type="text" value={checkOutValue.quantity} readOnly />
                        <button onClick={increment}>&#xff0b;</button>
                      </section>
                    </div>
                  </div>
                  <div
                    style={{ marginTop: '1rem' }}
                    className={checkOutValue?.discount > 0 ? 'price strike-through' : 'price'}
                  >
                    <p>Price</p>
                    <h2>{moneyFormater(price)}</h2>
                  </div>
                  {checkOutValue?.discount > 0 ? (
                    <div className="price discount-price" style={{ marginTop: '1rem' }}>
                      <p>Discounted Price</p>
                      <h2>{moneyFormater(discountedPrice)}</h2>
                    </div>
                  ) : null}
                </div>
                <div className="box-button">
                  <button className="add-to-bag" onClick={handleCheckoutProduct}>
                    ADD TO BAG
                    <img src={addIcon} />
                  </button>
                  <button
                    className="view-more__btn"
                    type="button"
                    onClick={() => {
                      directDetailProduct(data.handle, data?.brand_page?.page_ptr?.handle);
                    }}
                  >
                    View more details
                  </button>
                </div>
              </div>
              {
                //  ) : (
                //   ''
                // )}
              }
            </section>
          ) : (
            ''
          )}
        </div>
      </section>
      {/* {isTablet ? (
        <div className="quantity-price-bag pb-4">
          <div className="quantity-price-group">
            <div>
              <p>Quantity</p>
              <section className="quantity-box">
                <button onClick={decrement} disabled={checkOutValue.quantity <= 1}>
                  &mdash;
                </button>
                <input type="text" value={checkOutValue.quantity} readOnly />
                <button onClick={increment}>&#xff0b;</button>
              </section>
            </div>
            <div className="price">
              <p>Price</p>
              <h2>{price ? price : ''}</h2>
            </div>
          </div>
          <div className="box-button">
            <button className="add-to-bag" onClick={handleCheckoutProduct}>
              ADD TO BAG
              <img src={addIcon} />
            </button>
            <button
              className="view-more__btn"
              onClick={() => {
                directDetailProduct(data.handle, data?.brand_page?.page_ptr?.handle);
              }}
            >
              View more details
            </button>
          </div>
        </div>
      ) : (
        ''
      )} */}
    </section>
  ) : (
    <></>
  );
}

ProductDetailModal.propTypes = {
  data: PropTypes.object,
};

export default memo(ProductDetailModal);
