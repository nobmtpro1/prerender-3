import React, { memo } from 'react';

function BlockTitle(props: any) {
  return (
    <div className="container" style={props?.styleDiv}>
      <h1 className="title-block-default" style={props?.styleText}>
        {props?.title}
      </h1>
    </div>
  );
}

export default memo(BlockTitle);
