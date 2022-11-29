import React from 'react';

export default function DotLoader({ color }: { color?: string }) {
  return (
    <div className="wrapper-loading">
      <div className="lds-ellipsis">
        <div style={{ background: color }}></div>
        <div style={{ background: color }}></div>
        <div style={{ background: color }}></div>
        <div style={{ background: color }}></div>
      </div>
    </div>
  );
}
