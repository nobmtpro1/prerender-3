import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Slider from '../Slider';
import { isMobile } from '../../DetectScreen';
import Picture from '../Picture';
import starSolidIcon from '../../images/icons/star-solid.svg';
import starIcon from '../../images/icons/star-regular.svg';
import starHaftIcon from '../../images/icons/star-half-solid.svg';
import iconMale from '../../images/icons/collection-male.svg';
import iconFemale from '../../images/icons/collection-female.svg';
import iconUnisex from '../../images/icons/collection-unisex.svg';
import wishListIcon from '../../images/icons/wishlist-solid.svg';
import wishListActiveIcon from '../../images/icons/wishlist-regular.svg';
import olfactoryIcon from '../../images/icons/sundora-icons.svg';
import triangleTopIcon from '../../images/icons/triangle-top.svg';
import triangleBottomIcon from '../../images/icons/triangle-bottom.svg';
import triangleIcon from '../../images/icons/triangle.svg';
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
import { filter, find, isEmpty, map, sortBy, sumBy } from 'lodash';
import { addProductToCart } from '../../utils/helpers/productTracker';
import BlockShareSocial from '../BlockShareSocial';
import { Collapse } from 'react-collapse';
import Select from 'react-dropdown-select';
import LightboxImages from '../LightboxImages';

function ProductDetail({
  handleOpenModalNote,
  handleOutStockProduct,
  data,
  defaultVariant,
  inventory,
  isWishListChecked,
}: {
  handleOpenModalNote: any;
  handleOutStockProduct: any;
  data: any;
  defaultVariant: any;
  inventory: any;
  isWishListChecked: boolean;
}): JSX.Element {
  const [indexSlide, setIndexSlide] = useState(0);
  const [checkOutValue, setCheckOutValue] = useState<any>({ variant_id: null, quantity: 1 });
  const [price, setPrice] = useState<any>();
  const [discountedPrice, setDiscountedPrice] = useState<any>();
  const state = useSelector((state: RootStateOrAny) => state.productReducer);
  const [isWishList, setIsWishList] = useState<any>(null);
  const [inventoryVariant, setInventoryVariant] = useState<any>({});
  const [dataGender, setDataGender] = useState<any>({});
  const [tagsCollapse, setTagsCollapse] = useState<any>({});
  const [media, setMedia] = useState<any>([]);
  const [isOpenLightboxImages, setIsOpenLightboxImages] = useState<any>(false);
  const [currentVariantDiscount, setCurrentVariantDiscount] = useState<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentVariantDiscount(defaultVariant?.discount);
  }, [defaultVariant]);

  const handleOpenModal = (data: any) => {
    handleOpenModalNote(data);
  };

  const calculatePriceDiscount = (value: any, discountValue: any) => {
    return (parseFloat(value) * (100 - parseFloat(discountValue || 0))) / 100;
  };

  const handleChangeVariant = (data: any) => {
    setCheckOutValue({ ...data, quantity: 1 });
    setPrice(data?.price);
    setDiscountedPrice(calculatePriceDiscount(data?.price, data?.discount));
    setCurrentVariantDiscount(data?.discount);
  };

  const sortIndexMedia = (a: any, b: any) => {
    if (a.type == 'video' && a.position <= b.position) {
      return 0;
    }
    if (a.type == 'video' && a.position > b.position) {
      if (a.position == b.index || a.position < b.index) {
        return -1;
      }
    }
    return 1;
  };

  const getPerfumeType = (tags: string[]): string => {
    for (let i = 0; i < tags.length; i++) {
      if (PERFUME_TYPE_TAGS.includes(tags[i].toLowerCase()))
        return PERFUME_TYPE_MAP[tags[i].toLowerCase()];
    }
    return '';
  };

  useEffect(() => {
    setIndexSlide(0);

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

    // Tags collapse
    const tagsCollapseTemp: any = {};
    map(data?.translated_tags, (i: any) => {
      tagsCollapseTemp[i.id] = true;
    });
    setTagsCollapse(tagsCollapseTemp);

    // Images and Videos
    if (data?.images && data?.product_videos) {
      const videos = map(data?.product_videos, (i: any) => {
        return {
          ...i,
          type: 'video',
        };
      });
      const images = map(data?.images, (i: any) => {
        return {
          ...i,
          type: 'image',
        };
      });
      const mediaClone = [...videos, ...images];
      const sortMediaPosition = sortBy(mediaClone, ['position', 'preview_image']);
      const sortMedia = sortMediaPosition
        .map((i: any, index: any) => {
          return { ...i, index: ++index };
        })
        .sort(sortIndexMedia);

      setMedia(sortMedia);
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
    setCheckOutValue;
  }, [defaultVariant]);

  useEffect(() => {
    const invenVariant = find(
      inventory,
      (i: any) => i.variant_id == checkOutValue?.variant_id,
    );
    setInventoryVariant(invenVariant);
  }, [inventory, checkOutValue]);

  const setItemTagsCollapse = (tagId: any) => {
    const item: any = {};
    item[tagId] = !tagsCollapse[tagId];
    setTagsCollapse({ ...tagsCollapse, ...item });
  };

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
      price: calculatePriceDiscount(checkOutValue?.price, checkOutValue?.discount),
      title: checkOutValue?.title,
      quantity: quantity,
    });

    dispatch(action.checkoutProduct(copyArr));

    dispatch(actionHome.toggleShoppingbag(true));
  };

  const decrement = () => {
    setCheckOutValue({ ...checkOutValue, quantity: checkOutValue.quantity - 1 });
    setPrice(parseFloat(checkOutValue?.price) * (checkOutValue.quantity - 1));
    setDiscountedPrice(
      calculatePriceDiscount(
        parseFloat(checkOutValue?.price) * (checkOutValue.quantity - 1),
        checkOutValue?.discount,
      ),
    );
  };
  const increment = () => {
    if (!handleInventory('increment')) {
      return;
    }
    setCheckOutValue({ ...checkOutValue, quantity: checkOutValue.quantity + 1 });
    setPrice(parseFloat(checkOutValue?.price) * (checkOutValue.quantity + 1));
    setDiscountedPrice(
      calculatePriceDiscount(
        parseFloat(checkOutValue?.price) * (checkOutValue.quantity + 1),
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
      (i: any) => i?.variant_id == inventoryVariant?.variant_id,
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

  const dataFilterOlScent = filter(data.scents, (item) => item.type == 'olfactory');
  const dataTopScent = filter(data.scents, (item) => item.type == 'top');
  const dataHeartScent = filter(data.scents, (item) => item.type == 'heart');
  const dataBaseScent = filter(data.scents, (item) => item.type == 'base');
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
  const sum = sumBy(data?.reviews, (item: any) => item.star);
  const avg = Number(
    data?.reviews && sum ? (Math.round((sum / data?.reviews.length) * 2) / 2).toFixed(1) : 0,
  );

  return data ? (
    <section className="blk-product-detail">
      <section className="row">
        {data?.images ? (
          <div className="col-md-6 col-12" style={{ position: 'relative' }}>
            <div className="favorite-box">
              <div></div>
              <span
                className="sale-inf"
                style={{
                  visibility: currentVariantDiscount > 0 ? 'visible' : 'hidden',
                }}
              >
                {currentVariantDiscount > 0 ? `-${currentVariantDiscount}%` : ''}
              </span>
            </div>
            <LightboxImages
              isOpenLightboxImages={isOpenLightboxImages}
              setIsOpenLightboxImages={setIsOpenLightboxImages}
              imageList={media}
            />
            <Slider
              onSlideComplete={setIndexSlide}
              activeIndex={indexSlide}
              threshHold={isMobile ? 100 : 200}
              transition={isMobile ? 0.2 : 0.8}
              scaleOnDrag={false}
              isSquare={true}
              dragOrAuto={false}
            >
              {map(media, (item: any, index: number) => (
                <div key={index} className="animated faster fadeIn product-slide">
                  {item?.type == 'image' ? (
                    <>
                      <div onClick={() => setIsOpenLightboxImages(index)}>
                        <Picture data={{ ...item.url, loading: 'eager' }} />
                        <link itemProp="image" href={item?.url?.original} />
                      </div>
                    </>
                  ) : (
                    <>
                      <video
                        poster={item.preview_image}
                        width={'100%'}
                        height={'auto'}
                        controls={true}
                      >
                        <source src={item.src} type="video/mp4" />
                      </video>
                    </>
                  )}
                </div>
              ))}
            </Slider>
            <ul className="small-img-dot">
              {map(media, (item: any, index: number) => (
                <li
                  key={index}
                  className={`section-square ${
                    item.type == 'video' ? 'filter-brightness' : ''
                  }`}
                  onClick={() => setIndexSlide(index)}
                >
                  {item.type == 'image' ? (
                    <Picture data={item.url} />
                  ) : (
                    <>
                      <span className="material-icons play-icon">play_circle_outline</span>
                      <Picture
                        data={{
                          original: item.preview_image,
                          mobile: item.preview_image,
                          webp: item.preview_image,
                          alt: item.preview_image,
                        }}
                      />
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          ''
        )}
        <div className="col-md-6 col-12 box-shadow">
          {data?.product_variants ? (
            <section className="detail-product">
              <div>
                <div className={`${!isMobile ? 'd-flex justify-content-between' : ''} head`}>
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
                <div className="box-evaluate-share">
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
                  <div className="d-flex align-items-center box-share">
                    <p className="box-share__text-share">SHARE</p>
                    <BlockShareSocial width={36} height={36} />
                  </div>
                </div>
              </div>
              <div className="main">
                {data?.scents && data?.scents.length > 0 ? (
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
                          ))}
                        </div>
                      </li>
                    ) : (
                      ''
                    )}
                    {dataTopScent.length > 0 ? (
                      <li>
                        <div className="wrapper-img">
                          <img src={triangleTopIcon} alt="" />
                        </div>
                        <div className="scent-note">
                          <h4>TOP NOTES</h4>
                          {map(dataTopScent, (item: any, index: any) => (
                            <button key={index} onClick={() => handleOpenModal(item)}>
                              {item.name}
                            </button>
                          ))}
                        </div>
                      </li>
                    ) : (
                      ''
                    )}
                    {dataHeartScent.length > 0 ? (
                      <li>
                        <div className="wrapper-img">
                          <img src={triangleIcon} alt="" />
                        </div>
                        <div className="scent-note">
                          <h4>HEART NOTES</h4>
                          {map(dataHeartScent, (item: any, index: any) => (
                            <button key={index} onClick={() => handleOpenModal(item)}>
                              {item.name}
                            </button>
                          ))}
                        </div>
                      </li>
                    ) : (
                      ''
                    )}
                    {dataBaseScent.length > 0 ? (
                      <li>
                        <div className="wrapper-img">
                          <img src={triangleBottomIcon} alt="" />
                        </div>
                        <div className="scent-note">
                          <h4>BASE NOTES</h4>
                          {map(dataBaseScent, (item: any, index: any) => (
                            <button key={index} onClick={() => handleOpenModal(item)}>
                              {item.name}
                            </button>
                          ))}
                        </div>
                      </li>
                    ) : (
                      ''
                    )}
                  </ul>
                ) : (
                  ''
                )}
                {map(data?.translated_tags, (item: any, index: any) => (
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
              <div className="quantity-price-bag">
                <div className="quantity-price-group">
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
                            itemRenderer={({ item, methods }: { item: any; methods: any }) => {
                              return (
                                <div
                                  onClick={() =>
                                    !item?.disabled ? methods.addItem(item) : ''
                                  }
                                  className={`custom-item ${
                                    methods.isSelected(item) ? 'selected' : ''
                                  } ${item?.disabled ? 'disabled' : ''}`}
                                >
                                  <span>
                                    {item.title}{' '}
                                    {item?.discount > 0 && `(-${item?.discount}%)`}
                                  </span>
                                </div>
                              );
                            }}
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
                  <div className="quantity">
                    <p>Quantity</p>
                    <section className="quantity-box">
                      <button onClick={decrement} disabled={checkOutValue.quantity <= 1}>
                        &mdash;
                      </button>
                      <input type="text" value={checkOutValue.quantity} readOnly />
                      <button onClick={increment}>&#xff0b;</button>
                    </section>
                  </div>
                  <div
                    className={
                      parseFloat(discountedPrice) < parseFloat(price)
                        ? 'price strike-through'
                        : 'price'
                    }
                  >
                    <p>Price</p>
                    <h2>{moneyFormater(price)}</h2>
                  </div>
                  {parseFloat(discountedPrice) < parseFloat(price) ? (
                    <div className="price discount-price">
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
                          ? 'ADDED'
                          : 'ADD'
                        : isWishList
                        ? 'ADDED'
                        : 'ADD'}{' '}
                      TO WISH LIST
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
            </section>
          ) : (
            ''
          )}
        </div>
      </section>
    </section>
  ) : (
    <></>
  );
}

ProductDetail.propTypes = {
  data: PropTypes.object,
};

export default memo(ProductDetail);
