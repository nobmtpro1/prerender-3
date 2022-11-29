import React, { useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import icArrow from '../../images/icons/ic-arrow-right.svg';
import { Link } from 'react-router-dom';
import { map } from 'lodash';
import { isMobile } from '../../DetectScreen';
import Picture from '../Picture';

function ItemArticle({ articleItem }: { articleItem: any }) {
  const [isHover, setHover] = useState<boolean>(false);
  const [image, setImage] = useState<any>({});
  const refSquare = useRef<any>(null);

  const handleHoverItem = () => {
    setHover(!isHover);
  };

  useEffect(() => {
    if (refSquare && refSquare.current) {
      setImage({
        ...articleItem?.featured_image,
        width: refSquare.current.clientHeight,
        height: refSquare.current.clientHeight,
      });
    }
  }, [articleItem]);
  return (
    <>
      <div className="section-square" ref={refSquare}>
        <Link
          className={`article-item-box ${isHover ? 'on-hover' : ''}`}
          // style={{ backgroundImage: `url(${articleItem?.featured_image.original})` }}
          onMouseEnter={handleHoverItem}
          onMouseLeave={handleHoverItem}
          to={`/blog${articleItem.link.relative_url}`}
        >
          <Picture data={image} />
          {!isMobile ? (
            <div className="content">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h4>{articleItem.title}</h4>
                <p>
                  <img src={icArrow} alt="" />
                </p>
              </div>
            </div>
          ) : (
            ''
          )}
        </Link>
      </div>
      {isMobile ? (
        <div className="content-mobile">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4>{articleItem.title}</h4>
          </div>
        </div>
      ) : (
        ''
      )}
      <div className="tags-box">
        <span>Tags: </span>
        {map(articleItem?.tags, (item: any, index: any) => (
          <Link to={`/blogs/tags/${item?.name}`} key={index}>
            {item?.name}
          </Link>
        ))}
      </div>
    </>
  );
}

// itemProduct.propTypes = {
//   productItem: PropTypes.object.isRequired,
// };

export default ItemArticle;
