import React, { useEffect, useRef, useState } from 'react';
import { useSelector, RootStateOrAny } from 'react-redux';
import Marquee from 'react-fast-marquee';

export interface IHighlightMessage {
  text: string;
  page_url?: string;
  color?: {
    type: 'background_color' | 'font_color';
    value: string;
    id?: string;
  }[];
}

function BlockText(): JSX.Element {
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const textRef = useRef<(HTMLAnchorElement & HTMLDivElement) | null>(null);

  const [highlightTextData, setHighlightTextData] = useState<IHighlightMessage>({ text: '' });
  const state = useSelector((state: RootStateOrAny) => state.homeReducer);
  const fetchDataInit = () => {
    setHighlightTextData(state.globalHeaderMessage);
  };

  useEffect(() => {
    fetchDataInit();
    const container = textRef.current?.clientWidth;
    const text = textRef.current?.firstElementChild?.clientWidth;
    if (text && container && text > container) setShouldPlay(true);
  }, [state.globalHeaderMessage, highlightTextData]);

  function getMarkup() {
    return { __html: highlightTextData?.text };
  }

  function getColor(colorType: string) {
    return highlightTextData?.color?.find((clr) => clr.type === colorType);
  }

  const contentStyle = {
    backgroundColor: getColor('background_color')?.value || '#EBD9AC',
    color: getColor('font_color')?.value || 'black',
    paddingLeft: shouldPlay ? '1rem' : '',
    paddingRight: shouldPlay ? '1rem' : '',
  };

  if (highlightTextData?.page_url) {
    return (
      <Marquee
        speed={50}
        play={shouldPlay}
        pauseOnHover={!shouldPlay ? true : false}
        pauseOnClick={!shouldPlay ? true : false}
      >
        <a
          ref={textRef}
          href={highlightTextData?.page_url}
          className="block-text-container"
          style={contentStyle}
          dangerouslySetInnerHTML={getMarkup()}
        ></a>
      </Marquee>
    );
  } else {
    return (
      <Marquee
        speed={50}
        play={shouldPlay}
        pauseOnHover={!shouldPlay ? true : false}
        pauseOnClick={!shouldPlay ? true : false}
      >
        <div
          ref={textRef}
          className="block-text-container"
          style={contentStyle}
          dangerouslySetInnerHTML={getMarkup()}
        ></div>
      </Marquee>
    );
  }
}

export default BlockText;
