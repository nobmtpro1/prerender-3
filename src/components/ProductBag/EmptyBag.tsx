import React from 'react';
import ProductSlide from '../ProductSlide';

function EmptyBag(props: any) {
  return (
    <section className="empty-bag">
      <div className="content">
        <h3>0 Products</h3>
        <div className="d-flex justify-content-between">
          <span>Price</span>
          <span>0,00৳</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Shipping cost</span>
          <span>0,00৳</span>
        </div>
        <div className="d-flex justify-content-between">
          <hr></hr>
          <h2>0,00৳</h2>
        </div>
      </div>
      {props?.recommendationData && props?.recommendationData.length > 0 ? (
        <>
          <h4>Recommendations for you</h4>
          <ProductSlide
            data={props?.recommendationData}
            handleCloseShoppingBag={props.handleCloseShoppingBag}
            col={3}
          />
        </>
      ) : (
        ''
      )}
    </section>
  );
}
export default EmptyBag;
