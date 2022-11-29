import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import ItemProduct from './itemProduct';
import { map } from 'lodash';
import { isMobile } from '../../../DetectScreen';
import AwesomeSlider from 'react-awesome-slider';

function BlockProduct({
  productList,
  title,
  subTitle,
}: {
  productList: any;
  title: string;
  subTitle: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleSlider = (type: string) => {
    if (type == 'next') {
      setSelectedIndex(
        selectedIndex + 1 >= productList.length ? productList.length - 1 : selectedIndex + 1,
      );
      return;
    }
    if (type == 'prev') {
      setSelectedIndex(selectedIndex - 1 <= 0 ? 0 : selectedIndex - 1);
      return;
    }
  };

  return (
    <section className="blk-questionnaire-product">
      <div className="container">
        {/* Title */}
        {title ? <h3 className="title-block">{title}</h3> : ''}

        {/* Sub title */}
        {subTitle ? <p className="sub-title-block">{subTitle}</p> : ''}

        {/* line center */}
        <div className="line-center"></div>

        <div className={`${!isMobile ? 'row' : ''} list-product`}>
          {isMobile ? (
            <>
              <AwesomeSlider
                selected={selectedIndex}
                fillParent={false}
                mobileTouch={true}
                buttons={false}
                bullets={true}
                className="animation-slider"
                onTransitionEnd={(e: any) => {
                  setSelectedIndex(e.currentIndex);
                }}
              >
                {map(productList, (item: any, index: number) => (
                  <div
                    className="animated fasted fade-in"
                    key={index}
                    style={{ marginBottom: 16 }}
                  >
                    <ItemProduct productItem={item} />
                  </div>
                ))}
              </AwesomeSlider>
              <div className="group-button">
                <button
                  className={`next ${
                    selectedIndex == productList.length - 1 ? 'btn-end' : ''
                  }`}
                  onClick={() => {
                    handleSlider('next');
                  }}
                >
                  <span className="material-icons">navigate_next</span>
                </button>
                <button
                  className={`prev ${selectedIndex == 0 ? 'btn-end' : ''}`}
                  onClick={() => {
                    handleSlider('prev');
                  }}
                >
                  <span className="material-icons">navigate_next</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {map(productList, (item: any, index: number) => (
                <div
                  className="col-lg-3 col-md-4 col-6 animated fasted fade-in"
                  key={index}
                  style={{ marginBottom: 16 }}
                >
                  <ItemProduct productItem={item} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
BlockProduct.propTypes = {
  productList: PropTypes.array,
  title: PropTypes.string,
};

export default memo(BlockProduct);
