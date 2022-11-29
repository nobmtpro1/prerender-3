import React from 'react';
import Lottie from 'react-lottie';
import sundoraAnimation from '../../images/loader/sundora-loader.json';

function Loader(): JSX.Element {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: sundoraAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <section className="loader">
      {/* <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div> */}
      <Lottie
        options={defaultOptions}
        isClickToPauseDisabled={true}
        height={130}
        width={160}
      />
    </section>
  );
}
export default Loader;
