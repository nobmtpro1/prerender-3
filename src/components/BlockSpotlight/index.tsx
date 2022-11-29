import React, { lazy, memo } from 'react';
import PropTypes from 'prop-types';

const SpotlightV1 = lazy(() => import('./spotlightV1'));
const SpotlightV2 = lazy(() => import('./spotlightV2'));
const SpotlightV3 = lazy(() => import('./spotlightV3'));

function BlockSpotlight({ headline, items = [] }: { headline: string; items: any }) {
  const dataBlock = items && items[0] ? items[0].value.blocks : '';
  // const blockType = items.length;
  return dataBlock ? (
    <section className="blk-spotlight">
      <div className="container">
        <h3 className="title-block">{headline || 'in the spotlight'}</h3>
        {items.map((item: any, index: number) => {
          return item.value.blocks.length === 1 ? (
            <SpotlightV1 data={item?.value?.blocks} key={index} />
          ) : item.value.blocks.length === 2 ? (
            <SpotlightV2 data={item?.value?.blocks} key={index} />
          ) : item.value.blocks.length === 3 ? (
            <SpotlightV3 data={item?.value?.blocks} key={index} />
          ) : (
            ''
          );
        })}
      </div>
    </section>
  ) : (
    <></>
  );
}

BlockSpotlight.propTypes = {
  items: PropTypes.any,
};

export default memo(BlockSpotlight);
