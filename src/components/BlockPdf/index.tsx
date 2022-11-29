import React from 'react';
import { isMobile } from '../../DetectScreen/index';

const index = (props: any) => {
  const width = isMobile ? 100 : 84.3;
  return (
    <div
      style={{
        position: 'relative',
        width: width + 'vw',
        margin: '2vw auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height:
          parseFloat(props?.data?.dimensional_ratio) > 0
            ? width / parseFloat(props?.data?.dimensional_ratio) + 'vw'
            : '84vh',
      }}
    >
      {isMobile ? (
        <iframe
          src={`https://docs.google.com/viewer?url=${props?.data?.url}&embedded=true`}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '100%',
            width: '100%',
            border: 'none',
            overflow: 'hidden',
          }}
        ></iframe>
      ) : (
        <iframe
          frameBorder="0"
          src={props?.data?.url + `#toolbar=0&navpanes=0&scrollbar=0&view=fit`}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '100%',
            width: '100%',
            border: 'none',
            overflow: 'hidden',
          }}
        ></iframe>
      )}
    </div>
  );
};

export default index;
