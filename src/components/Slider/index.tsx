import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Slide from './Slide';

export function getPositionX(event: any) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

export function getElementDimensions(ref: any) {
  const width = ref.current.clientWidth;
  const height = ref.current.clientHeight;
  return { width, height };
}

function Slider({
  children,
  onSlideComplete,
  onSlideStart,
  activeIndex = null,
  threshHold = 100,
  transition = 0.3,
  scaleOnDrag = false,
  isSquare = false,
  dragOrAuto = false,
  slideInterval = 5000,
}: {
  children: any;
  onSlideComplete: any;
  onSlideStart: any;
  activeIndex: any;
  threshHold: number;
  transition: any;
  scaleOnDrag: boolean;
  isSquare: boolean;
  dragOrAuto: boolean;
  slideInterval?: number;
}) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const dragging = useRef<any>(false);
  const startPos = useRef<any>(0);
  const currentTranslate = useRef<any>(0);
  const prevTranslate = useRef<any>(0);
  const currentIndex = useRef<any>(activeIndex || 0);
  const sliderRef = useRef<any>('slider');
  const animationRef = useRef<any>(null);
  const [btnDotClick, setBtnDotClick] = useState<boolean>(false);

  const setPositionByIndex = useCallback(
    (w = dimensions.width) => {
      currentTranslate.current = currentIndex.current * -w;
      prevTranslate.current = currentTranslate.current;
      setSliderPosition();
    },
    [dimensions.width],
  );

  const transitionOn = () =>
    (sliderRef.current.style.transition = `transform ${transition}s ease-out`);

  const transitionOff = () => (sliderRef.current.style.transition = 'none');

  // watch for a change in activeIndex prop
  useEffect(() => {
    if (activeIndex !== currentIndex.current) {
      transitionOn();
      currentIndex.current = activeIndex;
      setPositionByIndex();
    }
  }, [activeIndex, setPositionByIndex]);

  // set width after first render
  // set position by startIndex
  // no animation on startIndex
  useLayoutEffect(() => {
    const elementDimensions = getElementDimensions(sliderRef);
    setDimensions(elementDimensions);

    setPositionByIndex(elementDimensions.width);

    if (elementDimensions.width == 0 && elementDimensions.height == 0) {
      const intervalCheckWidth = setInterval(() => {
        const elementDimensions = getElementDimensions(sliderRef);
        setDimensions(elementDimensions);
        setPositionByIndex(elementDimensions.width);
      }, 100);
      return () => clearInterval(intervalCheckWidth);
    }
  }, [setPositionByIndex]);

  // add event listeners
  useEffect(() => {
    // set width if window resizes
    const handleResize = () => {
      transitionOff();
      const { width, height } = getElementDimensions(sliderRef);
      setDimensions({ width, height });
      setPositionByIndex(width);
    };

    const handleKeyDown = ({ key }: { key: any }) => {
      const arrowsPressed = ['ArrowRight', 'ArrowLeft'].includes(key);
      if (arrowsPressed) transitionOn();
      if (arrowsPressed && onSlideStart) {
        onSlideStart(currentIndex.current);
      }
      if (key === 'ArrowRight' && currentIndex.current < children.length - 1) {
        currentIndex.current += 1;
      }
      if (key === 'ArrowLeft' && currentIndex.current > 0) {
        currentIndex.current -= 1;
      }
      if (arrowsPressed && onSlideComplete) onSlideComplete(currentIndex.current);
      setPositionByIndex();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [children.length, setPositionByIndex, onSlideComplete, onSlideStart]);

  function touchStart(index: any) {
    return function (event: any) {
      transitionOn();
      currentIndex.current = index;
      startPos.current = getPositionX(event);
      dragging.current = true;
      animationRef.current = requestAnimationFrame(animation);
      sliderRef.current.style.cursor = 'grabbing';
      // if onSlideStart prop - call it
      if (onSlideStart) onSlideStart(currentIndex.current);
    };
  }

  function touchMove(event: any) {
    if (dragging.current) {
      const currentPosition = getPositionX(event);
      currentTranslate.current = prevTranslate.current + currentPosition - startPos.current;
    }
  }

  function touchEnd() {
    transitionOn();
    cancelAnimationFrame(animationRef.current);
    dragging.current = false;
    const movedBy = currentTranslate.current - prevTranslate.current;

    // if moved enough negative then snap to next slide if there is one
    if (movedBy < -threshHold && currentIndex.current < children.length - 1)
      currentIndex.current += 1;

    // if moved enough positive then snap to previous slide if there is one
    if (movedBy > threshHold && currentIndex.current > 0) currentIndex.current -= 1;

    transitionOn();

    setPositionByIndex();
    sliderRef.current.style.cursor = 'grab';
    // if onSlideComplete prop - call it
    if (onSlideComplete) onSlideComplete(currentIndex.current);
  }

  function animation() {
    setSliderPosition();
    if (dragging.current) requestAnimationFrame(animation);
  }

  function setSliderPosition() {
    sliderRef.current.style.transform = `translateX(${currentTranslate?.current}px)`;
  }

  const setIndexTransitionInterval = () => {
    try {
      const keyIndexInterval = activeIndex + 1 >= children.length ? 0 : activeIndex + 1;
      transitionOn();
      onSlideComplete(keyIndexInterval);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (dragOrAuto) {
      const autoSlide = () => setTimeout(setIndexTransitionInterval, slideInterval);
      const auto = autoSlide();
      if (btnDotClick) {
        setBtnDotClick(false);
        return () => {
          clearTimeout(auto);
        };
      }
    }
  }, [activeIndex]);

  return (
    <div className={`${dragOrAuto ? 'block-slider' : 'slider-wrapper'}`}>
      {dragOrAuto ? (
        <>
          <div className="slider-wrapper">
            <ul className="slider-styles" ref={sliderRef}>
              {children.map((child: any) => (
                <li
                  key={child.key}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="slide-outer"
                >
                  <Slide
                    child={child}
                    sliderWidth={dimensions.width}
                    sliderHeight={dimensions.height}
                    scaleOnDrag={scaleOnDrag}
                    isSquareWrapper={isSquare}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="group-dot">
            {Array.from(Array(children.length).keys()).map((item: any, index: any) => (
              <div key={index} className="owl-page">
                <button
                  className={`btn-dot ${activeIndex == index ? 'btn-dot-active' : ''}`}
                  onClick={() => {
                    setBtnDotClick(true);
                    onSlideComplete(index);
                  }}
                ></button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <ul className="slider-styles" ref={sliderRef}>
          {children.map((child: any, index: any) => (
            <li
              key={child.key}
              onTouchStart={touchStart(index)}
              onMouseDown={touchStart(index)}
              onTouchMove={touchMove}
              onMouseMove={touchMove}
              onTouchEnd={touchEnd}
              onMouseUp={touchEnd}
              onMouseLeave={() => {
                if (dragging.current) touchEnd();
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="slide-outer"
            >
              <Slide
                child={child}
                sliderWidth={dimensions.width}
                sliderHeight={dimensions.height}
                scaleOnDrag={scaleOnDrag}
                isSquareWrapper={isSquare}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

Slider.propTypes = {
  children: PropTypes.node.isRequired,
  onSlideComplete: PropTypes.func,
  onSlideStart: PropTypes.func,
  activeIndex: PropTypes.number,
  threshHold: PropTypes.number,
  transition: PropTypes.number,
  scaleOnDrag: PropTypes.bool,
};

export default Slider;
