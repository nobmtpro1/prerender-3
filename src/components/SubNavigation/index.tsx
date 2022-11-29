import React, { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ProductSlide from '../ProductSlide';
import { map } from 'lodash';
import { RootStateOrAny, useSelector } from 'react-redux';

function SubNavigation({
  isOpen = null,
  title = '',
  dataChild = [],
  dataProduct = null,
  closeSubNav = null,
}: {
  isOpen: any;
  title: any;
  dataChild: any;
  dataProduct: any;
  closeSubNav: any;
}) {
  const childRef = useRef<any>(null);
  const [childPage, setChildPage] = useState<any>([]);
  const [positionChild, setPositionChild] = useState<any>(10);
  const [currentParent, setCurrentParent] = useState<any>(null);

  const userReducer = useSelector((state: RootStateOrAny) => state?.userReducer);

  const onHoverParent = (dataChild: any, index: any) => {
    if (dataChild == childPage) {
      setChildPage([]);
      setCurrentParent(null);
    } else {
      setChildPage(dataChild);
      setCurrentParent(dataChild.id);
    }

    let offsetTop = 0;
    if (index != 1) {
      if (dataChild?.children.length <= index * 2 - 1) {
        offsetTop = (index - 1) * 32;
      }
    } else {
      offsetTop = 0;
    }
    setPositionChild(() => offsetTop);
  };

  const onMouseLeave = () => {
    setChildPage([]);
    setCurrentParent(null);
  };

  return (
    <ul className={`blk-sub-nav ${isOpen == true ? 'open-menu' : ''}`}>
      <li>
        <div className="container">
          <div className="row">
            <div className="col-4">
              <h2>{title}</h2>
              <div
                className="wrapper-sub-menu"
                onMouseLeave={onMouseLeave}
                style={{
                  overflow: 'auto',
                }}
              >
                <ul>
                  {dataChild.map((item: any, index: any) => {
                    if (item?.visible_only_to_logged_in_users) {
                      if (!userReducer?.user) {
                        return;
                      }
                    }

                    return (
                      <li
                        key={index}
                        ref={childRef}
                        onMouseEnter={() => {
                          onHoverParent(item, index + 1);
                        }}
                      >
                        {item.disable_url ? (
                          <a className={`${currentParent == item.id ? 'activeParent' : ''}`}>
                            <span>{item.title} </span>
                            {item?.children.length > 0 || item.type == 'BrandPage' ? (
                              <i className="gg-chevron-right"></i>
                            ) : (
                              ''
                            )}
                          </a>
                        ) : (
                          <a
                            href={`${
                              item?.external_url
                                ? item?.external_url
                                : item?.relative_url
                                ? item?.relative_url
                                : '/'
                            }`}
                            className={`${currentParent == item.id ? 'activeParent' : ''}`}
                          >
                            <span>{item.title} </span>
                            {item?.children.length > 0 || item.type == 'BrandPage' ? (
                              <i className="gg-chevron-right"></i>
                            ) : (
                              ''
                            )}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <ul className="last-sub-flex">
                  <div
                    style={{
                      marginTop: positionChild,
                      transform:
                        positionChild > 0 && childPage.children
                          ? `translateY(-${(childPage?.children.length * 32) / 2 - 16}px)`
                          : 'unset',
                    }}
                  >
                    {map(childPage?.children, (itemchild, index) => {
                      if (itemchild?.visible_only_to_logged_in_users) {
                        if (!userReducer?.user) {
                          return;
                        }
                      }

                      return itemchild.type == 'BrandPage' ? (
                        <li key={index}>
                          <a
                            href={`${
                              itemchild?.external_url
                                ? itemchild?.external_url
                                : itemchild?.relative_url
                                ? itemchild?.relative_url
                                : '/'
                            }`}
                          >
                            {itemchild?.title}
                          </a>
                        </li>
                      ) : itemchild.type == 'FilteredPage' ? (
                        <li key={index}>
                          <a
                            href={`${
                              itemchild?.external_url
                                ? itemchild?.external_url
                                : itemchild?.relative_url
                                ? itemchild?.relative_url
                                : '/'
                            }`}
                          >
                            {itemchild?.title}
                          </a>
                        </li>
                      ) : (
                        <li key={index}>
                          <a
                            href={`${
                              itemchild?.external_url
                                ? itemchild?.external_url
                                : itemchild?.relative_url
                                ? itemchild?.relative_url
                                : '/'
                            }`}
                          >
                            <span>{itemchild.title}</span>
                          </a>
                        </li>
                      );
                    })}
                  </div>
                </ul>
              </div>
            </div>
            <div className="col-8">
              <h3 className="recommend-text">{dataProduct?.headline}</h3>
              {dataProduct && dataProduct.products && dataProduct.products.length > 0 ? (
                <ProductSlide data={dataProduct.products} col={2} closeSubNav={closeSubNav} />
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
}

SubNavigation.propTypes = {
  isOpen: PropTypes.any,
  title: PropTypes.string,
  dataChild: PropTypes.array,
  dataProduct: PropTypes.object,
};

export default memo(SubNavigation);
