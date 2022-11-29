import React from 'react';
import orderIc from '../../images/icons/shoppingCart-white.svg';
import avatarIc from '../../images/icons/avatar-white.svg';
import sundoraVipIc from '../../images/icons/ic-sundora-vip.svg';
import heartIc from '../../images/icons/heart-border-white.svg';
import tagIc from '../../images/icons/tag-white.svg';
import locationIc from '../../images/icons/location-white.svg';
function Icon({ name }: { name: any }) {
  const renderSwitch = (nameIc: any) => {
    switch (nameIc) {
      case 'order':
        return <img src={orderIc} />;
      case 'sundora-vip':
        return <img src={sundoraVipIc} width="24" />;
      case 'account':
        return <img src={avatarIc} />;
      case 'heart':
        return <img src={heartIc} />;
      case 'tag':
        return <img src={tagIc} />;
      case 'location':
        return <img src={locationIc} />;
      default:
        return '';
    }
  };
  return renderSwitch(name) ? <section className="icon">{renderSwitch(name)}</section> : <></>;
}
Icon.displayName = 'Icon';

export default Icon;
