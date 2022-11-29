import PropTypes from 'prop-types';
import React, { useRef } from 'react';

function Slide({
  child,
  sliderWidth,
  sliderHeight,
  scaleOnDrag = false,
  isSquareWrapper = false,
}: {
  child: any;
  sliderWidth: any;
  sliderHeight: any;
  scaleOnDrag: boolean;
  isSquareWrapper: boolean;
}) {
  const slideRef = useRef<any>('slide');

  const onMouseDown = () => {
    if (scaleOnDrag) slideRef.current.style.transform = 'scale(0.9)';
  };

  const onMouseUp = () => {
    if (scaleOnDrag) slideRef.current.style.transform = 'scale(1)';
  };
  return (
    <section
      className="slide-styles"
      ref={slideRef}
      style={{
        height: !isSquareWrapper
          ? `${window.innerHeight - 192}px`
          : `${slideRef.current.clientWidth}px`,
      }}
    >
      <div
        unselectable="on"
        className="slide-inner"
        style={{
          width: sliderWidth ? sliderWidth : 0,
          height:
            sliderHeight && !isSquareWrapper
              ? sliderHeight
              : `${slideRef.current.clientWidth}px`,
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchEnd={onMouseUp}
        onMouseLeave={onMouseUp}
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
      >
        {child}
      </div>
    </section>
  );
}

Slide.propTypes = {
  child: PropTypes.element.isRequired,
  sliderWidth: PropTypes.number.isRequired,
  sliderHeight: PropTypes.number.isRequired,
  scaleOnDrag: PropTypes.bool,
};

export default Slide;
