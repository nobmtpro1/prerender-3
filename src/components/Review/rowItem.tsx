import React, { useState } from 'react';
import Picture from '../Picture';
import { GET_REVIEWS } from '../../config';
import { fetchClient } from '../../redux/Helpers';
import toastr from 'toastr';
import { useHistory } from 'react-router';
import StarRating from '../StarRating';
function rowItem(props: any): JSX.Element {
  const { item } = props;
  //   const directDetailProduct = (handle, ) => {return ;}
  const [dataReview, setDatareview] = useState<any>('');
  const [star, setStar] = useState<any>(0);
  const [isAnonimous, setIsAnonimous] = useState<any>(false);

  const onChange = (event: any) => {
    setDatareview(event?.target.value);
  };

  const handleSelectStar = (value: any) => {
    setStar(value);
  };

  const handleCheck = () => {
    setIsAnonimous(!isAnonimous);
  };

  const handleSendReview = (item: any) => {
    if (dataReview == '') {
      toastr.error('Please enter reviews');
      return;
    }
    const options = {
      url: GET_REVIEWS,
      method: 'POST',
      body: {
        variant_id: item.variant_id,
        comment: dataReview,
        star: star || null,
        anonymous: isAnonimous,
      },
    };
    fetchClient(options).then((res) => {
      if (res?.success) {
        setDatareview('');
        setStar(0);
        setIsAnonimous(false);
        props.fetchDataReview();
        toastr.info('Review success');
      } else {
        toastr.error('Review error');
      }
    });
  };
  const history = useHistory();
  const directDetailProduct = (handle: any, brandName: any) => {
    history.push('/brand/' + brandName + '/' + handle);
  };
  return (
    <div className={`row-item row`}>
      {/* <div className="col-1 info"></div> */}
      <div
        className="col-md-2 col-3"
        onClick={() => directDetailProduct(item?.handle, item?.brand_page?.page_ptr?.handle)}
      >
        <div className="wrapper-img">
          <Picture data={item?.image?.url} />
        </div>
      </div>
      <div
        className="col-md-4 col-9 info"
        onClick={() => directDetailProduct(item?.handle, item?.brand_page?.page_ptr?.handle)}
      >
        <h4>{item?.title}</h4>
        <p>{item?.vendor}</p>
      </div>
      <div className="col-md-6 col-12 review-wrapper">
        <div className="review-section">
          <textarea rows={5} onChange={onChange} value={dataReview} />
          <StarRating onChange={handleSelectStar} star={star} />
          <label className="checkbox-button">
            <input
              type="checkbox"
              className="checkbox-button__input"
              id={`choice`}
              checked={isAnonimous}
              onChange={handleCheck}
            />
            <span className="checkbox-button__control"></span>
            <span className="checkbox-button__label">I want to remain anomynous</span>
          </label>
        </div>
        <button onClick={() => handleSendReview(item)}>Send reviews</button>
      </div>
    </div>
  );
}
export default rowItem;
