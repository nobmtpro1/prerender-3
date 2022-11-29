import React, { useEffect } from 'react';

function BlockModal({
  children,
  isOpen = false,
  minWidth,
  onClickAway,
  maskBg,
  onKeyPress,
  showCloseButton = true,
}: {
  children: any;
  isOpen: boolean;
  minWidth: string;
  maskBg: boolean;
  onKeyPress: any;
  onClickAway: any;
  showCloseButton?: boolean;
}) {
  const escFunction = (event: any) => {
    if (event.keyCode === 27) {
      onKeyPress();
    }
    window.removeEventListener('keydown', escFunction);
  };
  useEffect(() => {
    window.addEventListener('keydown', escFunction);
  }, []);
  return (
    <section
      className={`${`blk-modal animation faster ${isOpen ? 'fade-in' : 'fade-out d-none'}`}`}
    >
      <div style={{ minWidth: `${minWidth ? minWidth : '32%'}` }} className="panel">
        <div className="panel-header">
          {showCloseButton ? (
            <button
              className="btn-close"
              onClick={(e) => {
                e.stopPropagation();
                onClickAway();
              }}
            ></button>
          ) : null}
        </div>
        <div className="panel-body">{children}</div>
      </div>
      <div
        // className={`${isOpen ? 'mask' : 'mask-hidden'}`}
        className="mask"
        style={{
          backgroundColor: maskBg && isOpen ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0)',
        }}
        onClick={onClickAway ? onClickAway : null}
      />
    </section>
  );
}

export default BlockModal;
