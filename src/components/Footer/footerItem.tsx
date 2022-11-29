import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { map } from 'lodash';

function footerItem({ data = {} }: { data: any }) {
  const { children } = data;
  return (
    <div className="item-box">
      {data?.relative_url ? (
        <Link to={data?.relative_url} className="py-1">
          {data.title}
        </Link>
      ) : (
        <h3>{data.title}</h3>
      )}
      <ul>
        {map(children, (item: any, index: number) => (
          <li key={index}>
            <a
              href={
                item?.external_url
                  ? item?.external_url
                  : item?.relative_url
                  ? item?.relative_url
                  : '/'
              }
              className="py-1"
            >
              <span className="icon-format material-icons" style={{ top: 0, left: -28 }}>
                {item?.menu_icon}
              </span>
              <span>{item.title} </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

footerItem.propTypes = {
  data: PropTypes.object,
};

export default footerItem;
