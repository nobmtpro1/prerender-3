import { map } from 'lodash';
import React, { useEffect, useState } from 'react';
import starSolidIcon from '../../images/icons/star-solid.svg';
import starIcon from '../../images/icons/star-regular.svg';

function StarRating(props: any) {
  const [state, setState] = useState<any>({
    stars: [1, 2, 3, 4, 5],
    rating: 0,
    hovered: 0,
  });

  useEffect(() => {
    setState({
      stars: [1, 2, 3, 4, 5],
      rating: props?.star || 0,
      hovered: 0,
    });
  }, [props.star]);

  const changeRating = (newRating: any) => {
    setState({ ...state, rating: newRating });

    if (props.onChange) props.onChange(newRating);
  };

  const hoverRating = (rating: any) => {
    const cloneState = { ...state };
    cloneState.hovered = rating;
    setState(cloneState);
  };
  const { stars, rating, hovered } = state;
  return (
    <section className="rating">
      <span className="title">Overall rating:</span>
      {map(stars, (star: any, index: any) => {
        return (
          <span
            style={{ cursor: 'pointer' }}
            key={index}
            onClick={() => {
              changeRating(star);
            }}
            onMouseEnter={() => {
              hoverRating(star);
            }}
            onMouseLeave={() => {
              hoverRating(0);
            }}
          >
            {rating < star ? (
              hovered < star ? (
                <img src={starIcon} alt="" />
              ) : (
                <img src={starSolidIcon} alt="" />
              )
            ) : (
              <img src={starSolidIcon} alt="" />
            )}
          </span>
        );
      })}
    </section>
  );
}
export default StarRating;
