import React from 'react';

function LdsLoader({ classes }: { classes?: string }) {
  return (
    <div
      className={`lds-roller ${classes ? classes : ''}`}
      style={{ transform: 'scale(0.5)', bottom: '-5px', left: '-35px' }}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default LdsLoader;
