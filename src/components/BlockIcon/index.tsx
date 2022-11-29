import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Picture from '../Picture';

function BlockIcon({ iconList = [] }: { iconList: any }) {
  return (
    <section className="blk-icon">
      <div className="container">
        <ul>
          {iconList.map((item: any, index: number) => (
            <li key={index}>
              <Picture data={item.icon_image} />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

BlockIcon.propTypes = {
  iconList: PropTypes.array,
};

export default memo(BlockIcon);
