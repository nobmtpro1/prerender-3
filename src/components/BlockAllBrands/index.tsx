import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { map, reduce } from 'lodash';

const alphabet = [
  '#',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

function BlockAllBrands({ data }: { data: any }) {
  const brands = reduce(
    data.brands,
    (r: any, e: any) => {
      // get first letter of name of current element
      let group = e.name[0];
      if (group == '#' || (group != '#' && alphabet.indexOf(group) == -1)) {
        group = '#';
      }

      // if there is no property in accumulator with this letter create it
      if (!r[group]) r[group] = { group, children: [e] };
      // if there is push current element to children array for that letter
      else r[group].children.push(e);
      // return accumulator
      return r;
    },
    {},
  );
  const resultGroupBrandsAlphabet = Object.values(brands);
  return (
    <>
      <section className="blk-all-brands container">
        <div className="box-title">
          <h1>{data?.headline}</h1>
        </div>
        <div className="box-alphabet">
          {map(alphabet, (i: any, index: number) => (
            <div key={index} className="box-alphabet__detail">
              <a href={`#${i}`}>{i}</a>
            </div>
          ))}
        </div>
        <div className="box-all-brands">
          {resultGroupBrandsAlphabet
            .sort((a: any, b: any) => a.group.localeCompare(b.group))
            .map((item: any, index: any) => (
              <div id={item.group} key={index} className="box-all-brands__detail">
                <h2>{item.group}</h2>
                <ul>
                  {map(item.children, (i: any, childIndex: any) => (
                    <li key={childIndex}>
                      <a
                        className={`${i?.brand_page?.relative_url ? '' : 'un-active'}`}
                        href={i?.brand_page?.relative_url}
                        dangerouslySetInnerHTML={{ __html: i.name }}
                      ></a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
BlockAllBrands.propTypes = {
  data: PropTypes.object,
};

export default memo(BlockAllBrands);
