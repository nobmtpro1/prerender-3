import React, { useEffect, useState } from 'react';
import { fetchClient } from '../../redux/Helpers';
import { GET_REVIEWS } from '../../config';
import { map } from 'lodash';
import RowItem from './rowItem';
import { isMobile } from '../../DetectScreen';

const Review = (): JSX.Element => {
  const [state, setState] = useState([]);

  const fetchDataReview = () => {
    const options = {
      url: GET_REVIEWS,
      method: 'GET',
      body: null,
    };
    fetchClient(options).then((res: any) => {
      if (res.success) {
        setState(res.data);
      }
    });
  };

  useEffect(() => {
    fetchDataReview();
  }, []);

  return (
    <section className="tab-Reviews animated faster fadeIn">
      <h1>MY REVIEWS</h1>
      <div className="head row">
        <div className="col-2">
          <p>Product</p>
        </div>
        <div className="col-4"></div>
        <div className="col-6">{!isMobile ? <p>Reviews</p> : ''}</div>
      </div>
      {state.length ? (
        map(state, (item: any, index) => (
          <RowItem item={item} key={index} fetchDataReview={fetchDataReview} />
        ))
      ) : (
        <div className="row">
          <div className="col-12 no-review">No review found</div>
        </div>
      )}
    </section>
  );
};

export default Review;
