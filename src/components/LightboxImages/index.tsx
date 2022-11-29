import React, { useState, useEffect } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

const LightboxImages = ({
  isOpenLightboxImages,
  setIsOpenLightboxImages,
  imageList,
}: {
  isOpenLightboxImages: any;
  setIsOpenLightboxImages: any;
  imageList: any;
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([
    '//placekitten.com/1500/500',
    '//placekitten.com/4000/3000',
    '//placekitten.com/800/1200',
    '//placekitten.com/1500/1500',
  ]);

  useEffect(() => {
    setIsOpen(isOpenLightboxImages === false ? false : true);
    setPhotoIndex(isOpenLightboxImages >= 0 ? isOpenLightboxImages : 0);
    const noScroll = () => {
      const html: any = document.querySelector('html');
      html.classList.add('noscroll');
    };
    const resetScroll = () => {
      const html: any = document.querySelector('html');
      html.classList.remove('noscroll');
    };
    if (isOpenLightboxImages !== false) {
      noScroll();
    } else {
      resetScroll();
    }
  }, [isOpenLightboxImages]);

  useEffect(() => {
    const arrImages: any = [];
    imageList.forEach((image: any) => {
      arrImages.push(image?.url?.original);
    });
    setImages(arrImages);
  }, [imageList]);

  return (
    <div>
      {isOpen === true && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpenLightboxImages(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
        />
      )}
    </div>
  );
};

export default LightboxImages;
