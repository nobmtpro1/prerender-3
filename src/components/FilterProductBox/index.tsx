import React, { memo, useEffect, useMemo, useState } from 'react';
import { reduce, map, find } from 'lodash';
import { isMobile } from '../../DetectScreen';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import * as action from '../../redux/product/actions';
import { moneyFormater, slugToTitle } from '../../redux/Helpers';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { isDesktop } from 'react-device-detect';

function FilterProductBox(props: any) {
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const dispatch = useDispatch();
  const [toogleRow, setToogleRow] = useState<any>({});
  const data = reduce(
    props?.dataBrands,
    (r: any, e: any) => {
      const group = e.name[0];
      if (!r[group]) r[group] = { group, children: [e] };
      else r[group].children.push(e);
      return r;
    },
    {},
  );
  const [priceRange, setPriceRange] = useState<any>({
    minPrice: 500,
    maxPrice: 500,
  });
  const [isDefaultPriceRange, setIsDefaultPriceRange] = useState<boolean>(false);

  const resultGroupObjectAlphabet = Object.values(data);

  const isOpenFilterBox = useSelector(
    (state: RootStateOrAny) => state.productReducer.isOpenFilterBox,
  );

  const closeFilterBox = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
    dispatch(action.toogleFilterBox(false));
  };

  const clearFilterMobile = () => {
    props.handleClearFilter();
  };

  const activeRowMobile = (idRow: any) => {
    if (idRow == toogleRow.id) {
      setToogleRow({ id: idRow, isActive: !toogleRow.isActive });
    } else {
      setToogleRow({ id: idRow, isActive: true });
    }
  };

  useEffect(() => {
    if (props.priceRange.minPrice && props.priceRange.maxPrice && !isDefaultPriceRange) {
      setIsDefaultPriceRange(true);
      setPriceRange({
        minPrice: parseInt(props?.priceRange?.minPrice),
        maxPrice: parseInt(props?.priceRange?.maxPrice),
      });
    }
  }, [props?.priceRange]);

  return (
    <section
      className={`filter-box ${isMobile ? 'filter-box-mobile' : ''} ${
        isMobile && isOpenFilterBox ? 'active' : ''
      }`}
    >
      {isMobile ? (
        <div className="header-filter-mobile">
          <button onClick={closeFilterBox}>
            <i className="gg-close"></i>
          </button>
          <h2>FILTER PRODUCTS</h2>
        </div>
      ) : (
        ''
      )}
      <div className="header-filter">
        <p className="text-title-filter">
          <span className="material-icons">filter_list</span>
          Filter results
        </p>
        {isMobile ? (
          ''
        ) : (
          <button className="btn-clear" onClick={props.handleClearFilter}>
            Reset filters
          </button>
        )}
      </div>
      <section className="result-filter-box">
        <ul className="result-list">
          {map(props.filterSelection, (item, index) => {
            switch (item.type) {
              case 'minMax':
                return isDesktop ? (
                  ''
                ) : (
                  <li key={index}>
                    <span>
                      {`${moneyFormater(priceRange.minPrice)} - ${moneyFormater(
                        priceRange.maxPrice,
                      )}`}
                    </span>
                    <button onClick={props.handleRemovePriceFilter}>
                      <i className="gg-close"></i>
                    </button>
                  </li>
                );
              case 'other':
                return (
                  <li key={index}>
                    <span>
                      {props?.dataOther
                        ? find(props?.dataOther, (i) => i.handle == item.value)
                          ? find(props?.dataOther, (i) => i.handle == item.value).title
                          : item.name
                        : item.name}
                    </span>
                    <button>
                      <i
                        onClick={() => props.handleRemoveOtherFilter(item.value)}
                        className="gg-close"
                      ></i>
                    </button>
                  </li>
                );
              case 'scent':
                return (
                  <li key={index}>
                    <span>
                      {props?.dataScents
                        ? find(props?.dataScents, (i) => i.id == item.value)?.name
                        : ''}
                    </span>
                    <button>
                      <i
                        onClick={() => props.handleRemoveScentFilter(item.value)}
                        className="gg-close"
                      ></i>
                    </button>
                  </li>
                );
              case 'tags':
              case 'tags_and':
                return (
                  <li key={index}>
                    <span>{slugToTitle(item.value)}</span>
                    <button>
                      <i
                        onClick={() => props.handleRemoveTagsFilter(item.value)}
                        className="gg-close"
                      ></i>
                    </button>
                  </li>
                );
              case 'brands':
                return (
                  <li key={index}>
                    <span>
                      {props?.dataBrands
                        ? find(props?.dataBrands, (i) => i.id == item.value)?.name
                        : item?.name}
                    </span>
                    <button>
                      <i
                        onClick={() => props.handleRemoveBrandsFilter(item.value)}
                        className="gg-close"
                      ></i>
                    </button>
                  </li>
                );
              default:
                break;
            }
          })}
        </ul>
      </section>
      <div className="wrapper-filter-box">
        <div className="min-max">
          <h3 className="flex-icon" onClick={() => activeRowMobile('min-max')}>
            PRICE <i className="gg-chevron-down" />
          </h3>
          <div
            className={`${
              toogleRow.id == 'min-max' && toogleRow.isActive == true ? 'active-child' : ''
            }`}
          >
            <p className="text-price-range">{`${moneyFormater(priceRange.minPrice)} - ${
              priceRange.maxPrice != 500
                ? moneyFormater(priceRange.maxPrice)
                : moneyFormater(props?.maxPrice)
            }`}</p>
            <InputRange
              step={50}
              minValue={500}
              maxValue={props?.maxPrice ?? 500000}
              formatLabel={(value: any, e: any) => e}
              value={{
                min: priceRange.minPrice,
                max: priceRange.maxPrice != 500 ? priceRange.maxPrice : props?.maxPrice,
              }}
              onChange={(value: any) => {
                if (value.min == 0) {
                  value.min = 500;
                }
                setPriceRange({
                  minPrice: value.min,
                  maxPrice: value.max,
                });
              }}
              onChangeComplete={(value: any) => {
                props.setPriceRange({ minPrice: value.min, maxPrice: value.max });
              }}
            />
          </div>
          {props.validateFilter.minMax ? (
            <p style={{ color: '#f38e8e', fontSize: '12px', marginTop: 8 }}>
              {props.validateFilter.minMax}
            </p>
          ) : (
            ''
          )}
        </div>

        <div className="order">
          <h3 onClick={() => activeRowMobile('gender')} className="flex-icon">
            Gender <i className="gg-chevron-down" />
          </h3>
          <div
            className={`${
              toogleRow.id == 'gender' && toogleRow.isActive == true ? 'active-child' : ''
            }`}
          >
            {map(props?.dataOther, (item, index) =>
              item?.handle == 'man' || item?.handle == 'unisex' || item?.handle == 'woman' ? (
                <label className="checkbox-button" key={index}>
                  <input
                    type="checkbox"
                    className="checkbox-button__input"
                    id={`choice1-${index}`}
                    name={item?.title}
                    value={item?.handle}
                    onChange={props.handleCheckOther}
                    checked={
                      find(
                        props.filterSelection,
                        (i: any) => item?.handle == i?.value && i?.type == 'other',
                      ) || false
                    }
                  />
                  <span className="checkbox-button__control"></span>
                  <span className="checkbox-button__label">{item?.title}</span>
                </label>
              ) : (
                ''
              ),
            )}
          </div>
        </div>

        {props?.dataScents && props?.isPerfume ? (
          <div className="order">
            <h3 onClick={() => activeRowMobile('scent')} className="flex-icon">
              SCENT FAMILY <i className="gg-chevron-down" />
            </h3>
            <div
              className={`wrapper-scent ${
                toogleRow.id == 'scent' && toogleRow.isActive == true ? 'active-child' : ''
              }`}
            >
              {map(props?.dataScents, (item, index) => (
                <label className="checkbox-button" key={index}>
                  <input
                    type="checkbox"
                    className="checkbox-button__input"
                    id={`choice1-${index}`}
                    name={item?.name}
                    value={item?.id ? item?.id : ''}
                    onChange={props.handleCheckScent}
                    checked={
                      find(
                        props.filterSelection,
                        (i: any) => item?.id == i?.value && i?.type == 'scent',
                      ) || false
                    }
                  />
                  <span className="checkbox-button__control"></span>
                  <span className="checkbox-button__label">{item?.name}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}

        {props?.customFilter?.map((customFilter: any, i: any) => (
          <div className="order" key={i}>
            <h3 onClick={() => activeRowMobile('gender')} className="flex-icon">
              {customFilter?.title} <i className="gg-chevron-down" />
            </h3>
            <div
              className={`${
                toogleRow.id == 'gender' && toogleRow.isActive == true ? 'active-child' : ''
              }`}
            >
              {customFilter?.tags?.map((tag: any, k: any) => (
                <label className="checkbox-button" key={k}>
                  <input
                    type="checkbox"
                    className="checkbox-button__input"
                    id={`choice1-${k}`}
                    name={tag?.slug}
                    value={tag?.slug}
                    onChange={props?.handleCheckTags}
                    checked={
                      params
                        ?.get('tags_and')
                        ?.split(',')
                        ?.find((x: any) => x == tag?.slug)
                        ? true
                        : false
                    }
                  />
                  <span className="checkbox-button__control"></span>
                  <span className="checkbox-button__label">{tag?.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {props?.dataBrands ? (
          <div className="order brand-filter">
            <h3 onClick={() => activeRowMobile('brand')} className="flex-icon">
              Brands <i className="gg-chevron-down" />
            </h3>
            <div
              className={`wrapper-alpha-box ${
                toogleRow.id == 'brand' && toogleRow.isActive == true ? 'active-child' : ''
              }`}
            >
              {resultGroupObjectAlphabet
                .sort((a: any, b: any) => a.group.localeCompare(b.group))
                .map((item: any, index: any) => (
                  <div className="alpha-box" key={index}>
                    <label>{item?.group}</label>
                    <div className="check-box-group">
                      {map(item.children, (i, index) => (
                        <label className="checkbox-button" key={index}>
                          <input
                            type="checkbox"
                            className="checkbox-button__input"
                            id={`choice1-${index}`}
                            name={i?.name}
                            value={i?.id ? i?.id : ''}
                            onChange={props.handleCheckBrand}
                            checked={
                              find(props.filterSelection, (item: any) => {
                                return item?.value == i?.id && item?.type == 'brands';
                              }) || false
                            }
                          />
                          <span className="checkbox-button__control"></span>
                          <span className="checkbox-button__label">{i?.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          ''
        )}
        {props?.dataTags && false ? (
          <div className="order">
            <h3 onClick={() => activeRowMobile('tags')} className="flex-icon">
              Tags <i className="gg-chevron-down" />
            </h3>
            <div
              className={`wrapper-scent ${
                toogleRow.id == 'tags' ||
                (toogleRow.id == 'tags_and' && toogleRow.isActive == true)
                  ? 'active-child'
                  : ''
              }`}
            >
              {map(props?.dataTags, (item, index) => (
                <label className="checkbox-button" key={index}>
                  <input
                    type="checkbox"
                    className="checkbox-button__input"
                    id={`choicetags-${index}`}
                    name={item?.name}
                    value={item?.slug ? item?.slug : ''}
                    onChange={props.handleCheckTags}
                    checked={
                      find(
                        props.filterSelection,
                        (i: any) =>
                          (item?.slug == i?.value && i?.type == 'tags') ||
                          (item?.slug == i?.value && i?.type == 'tags_and'),
                      ) || false
                    }
                  />
                  <span className="checkbox-button__control"></span>
                  <span className="checkbox-button__label">{item?.name}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}
        {isMobile ? (
          <div className="btn-group-mobile">
            <button onClick={clearFilterMobile}>Reset filters</button>
            <button onClick={closeFilterBox}>Show results</button>
          </div>
        ) : (
          ''
        )}
      </div>
    </section>
  );
}
export default memo(FilterProductBox);
