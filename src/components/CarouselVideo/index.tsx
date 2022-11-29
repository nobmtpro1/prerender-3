import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

export interface ICarouselVideo {
  width?: string;
  src: string;
  type: string;
  link?: string;
  muted?: boolean;
  autoplay?: boolean;
  loop?: boolean;
}

function CarouselVideo({
  width = '100%',
  src,
  type,
  link,
  muted = true,
  autoplay = true,
  loop = true,
}: ICarouselVideo) {
  const videoPreview = () => {
    return (
      <div className="video-wrapper">
        <video
          style={{
            width: width,
            height: isMobile ? 'auto' : '100%',
          }}
          className="video-preview"
          muted={muted}
          autoPlay={autoplay}
          loop={loop}
        >
          <source src={src} type={type} />
        </video>
      </div>
    );
  };

  if (link) {
    return <Link to={link}>{videoPreview()}</Link>;
  } else {
    {
      return videoPreview();
    }
  }
}

CarouselVideo.propTypes = {
  item: PropTypes.object,
};

export default memo(CarouselVideo);
