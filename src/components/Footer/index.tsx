import React, { memo } from 'react';
import icFaceBook from '../../images/icons/ic-facebook.svg';
import icInsta from '../../images/icons/ic-insta.svg';
import icLinkedIn from '../../images/icons/ic-linkedin.svg';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import FooterItem from './footerItem';
import { PHONE_CONTACT } from '../../config';

function Footer({ data = [] }: { data: any }) {
  return (
    <footer className="blk-footer">
      <div className="content container">
        <div>
          <div className="item-box">
            <h3>contact</h3>
            <ul>
              <li>
                <a>
                  <span className="icon-format material-icons" style={{ top: -4, left: -28 }}>
                    call
                  </span>
                  {PHONE_CONTACT}
                </a>
              </li>
              <li>Sun - Thu 10.00 AM - 8.00 PM</li>
              <li>
                <a href="mailto:support@sundora.com.bd">
                  <span className="icon-format material-icons" style={{ top: -4, left: -28 }}>
                    email
                  </span>
                  support@sundora.com.bd
                </a>
              </li>
              <li style={{ marginTop: '1rem' }}>
                <a
                  href={`https://www.google.com/maps/search/${encodeURI(
                    'Anabil Tower, Plot #3, Block - NW(J), Gulshan North Avenue, Kemal Ataturk Ave, Dhaka -1212, Bangladesh',
                  )}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="icon-format material-icons" style={{ top: -4, left: -28 }}>
                    location_on
                  </span>
                  <p className="location">
                    Anabil Tower, Plot #3, Block - NW(J), Gulshan North Avenue, Kemal Ataturk
                    Ave, Dhaka -1212, Bangladesh
                  </p>
                </a>
              </li>
            </ul>
            <ul className="social-group">
              <li>
                <a
                  target="__blank"
                  href="https://bd.linkedin.com/company/sundora?trk=public_profile_topcard-current-company"
                >
                  <img
                    className="linkedin"
                    src={icLinkedIn}
                    width={35}
                    height={22}
                    alt="ic-linkedin"
                  />
                </a>
              </li>
              <li>
                <a target="__blank" href="https://www.facebook.com/sundorabeauty">
                  <img src={icFaceBook} width={14} height={22.39} alt="ic-facebook" />
                </a>
              </li>
              <li>
                <a target="__blank" href="https://www.instagram.com/sundorabeauty">
                  <img src={icInsta} width={21} height={24} alt="ic-instagram" />
                </a>
              </li>
            </ul>
          </div>
          <div className="item-box">
            <h3>visit</h3>
            <ul>
              <li>
                <span>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURI(
                      'Green City Square, Gr. Floor - Semi-basement, 750, Satmasjid Road, Dhanmondi',
                    )}/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span
                      className="icon-format material-icons"
                      style={{ top: -4, left: -28 }}
                    >
                      location_on
                    </span>
                    <p className="location">
                      Green City Square, Gr. Floor - Semi-basement, 750, Satmasjid Road,
                      Dhanmondi
                    </p>
                  </a>
                </span>
              </li>
            </ul>
            <ul>
              <li>
                <span>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURI(
                      'Delvista, Banani Rd# 12, FL# 3, H# 44, Banani',
                    )}/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span
                      className="icon-format material-icons"
                      style={{ top: -4, left: -28 }}
                    >
                      location_on
                    </span>
                    <p className="location">
                      DELVISTA, FL# 3, H# 44,RD# 12, BANANI 1213, DHAKA
                    </p>
                  </a>
                </span>
              </li>
            </ul>
            <ul>
              <li>
                <span>
                  {' '}
                  <a
                    href={`https://www.google.com/maps/search/${encodeURI(
                      'Ventura Agnibeena, Gr. Floor, H#38, Rd#12, Banani',
                    )}/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span
                      className="icon-format material-icons"
                      style={{ top: -4, left: -28 }}
                    >
                      location_on
                    </span>
                    <p className="location">
                      Ventura Agnibeena, Gr. Floor, H#38, Rd#12, Banani
                    </p>
                  </a>
                </span>
              </li>
            </ul>
            <ul>
              <li>
                <span>
                  {' '}
                  <a
                    href={`https://www.google.com/maps/search/${encodeURI(
                      'Casablanca, 114 Gulshan Ave, Gr. Floor, Gulshan',
                    )}/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span
                      className="icon-format material-icons"
                      style={{ top: -4, left: -28 }}
                    >
                      location_on
                    </span>
                    <p className="location">Casablanca, 114 Gulshan Ave, Gr. Floor, Gulshan</p>
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div>
          {map(data, (item: any, index: number) => (
            <FooterItem data={item} key={index} />
          ))}
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  iconList: PropTypes.array,
};

export default memo(Footer);
