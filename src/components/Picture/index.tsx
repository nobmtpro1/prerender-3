import React from 'react';
import PropTypes from 'prop-types';

function Picture({ data }: { data: any }) {
  return (
    <picture className="animated faster fade-in">
      <source srcSet={data?.mobile} type="image/webp" media="(max-width: 768px)" />
      <source srcSet={data?.webp} type="image/webp" />
      <img
        loading={data?.loading ?? 'lazy'}
        src={data?.original}
        alt={data?.alt}
        width={data?.width}
        height={data?.height}
        style={{ maxHeight: data?.maxHeight, maxWidth: data?.maxWidth }}
      />
    </picture>
  );
}

Picture.propTypes = {
  data: PropTypes.any,
};

export default Picture;
