import React, { memo, useEffect, useState } from 'react';
import { SocialIcon } from 'react-social-icons';
import './block-share-social.scss';
import icMessenger from '../../images/icons/ic-messenger.svg';
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
} from 'react-share';
import { GET_SOCIAL_MEDIA_CLIENT_IDS, POST_EARN_POINT_SHARE_SOCIAL } from '../../config';
import { fetchClient, toastrSuccess } from '../../redux/Helpers';
import moment from 'moment';

declare type Type = 'facebook' | 'whatsapp' | 'messenger';

function BlockShareSocial(props: any): JSX.Element {
  const [fbClientID, setFBClientID] = useState<any>('');
  const [timeBeforeShare, setTimeBeforeShare] = useState<any>('');
  const [width, height] = [props?.width ?? 45, props?.height ?? 45];

  const handleBeforeShare = async () => {
    const time = moment(new Date());
    setTimeBeforeShare(time);
  };

  const handleShareSuccess = async (type: Type) => {
    const token = localStorage.getItem('sundoraToken');
    if (!token) {
      return;
    }

    const end = moment(new Date());
    const duration = moment.duration(end.diff(timeBeforeShare));
    const seconds = duration.asSeconds();

    const options = {
      url: POST_EARN_POINT_SHARE_SOCIAL,
      method: 'POST',
      body: {
        type,
      },
    };

    if (
      (type == 'facebook' && seconds < 8) ||
      (type == 'whatsapp' && seconds < 8) ||
      (type == 'messenger' && seconds < 10) ||
      (type == 'facebook' && seconds > 60) ||
      (type == 'whatsapp' && seconds > 60) ||
      (type == 'messenger' && seconds > 60)
    ) {
      return;
    }

    fetchClient(options).then((res) => {
      if (res.success) {
        toastrSuccess('You have received points for sharing the product');
        return;
      }
    });
  };

  useEffect(() => {
    const options = {
      url: GET_SOCIAL_MEDIA_CLIENT_IDS,
      method: 'GET',
      body: null,
    };
    fetchClient(options).then((res: any) => {
      if (res.success) {
        setFBClientID(res?.data.find((i: any) => i.provider == 'facebook')?.client_id);
      }
    });
  }, []);

  return (
    <div className={`blk-share-social ${props?.className}`}>
      <div className="group-social">
        <FacebookShareButton
          windowPosition="windowCenter"
          url={window.location.href}
          beforeOnClick={() => handleBeforeShare()}
          onShareWindowClose={() => handleShareSuccess('facebook')}
        >
          <SocialIcon
            network="facebook"
            bgColor="#ffffff"
            fgColor="#000000"
            style={{ width: width, height: height }}
          />
        </FacebookShareButton>
        <WhatsappShareButton
          url={window.location.href}
          beforeOnClick={() => handleBeforeShare()}
          onShareWindowClose={() => handleShareSuccess('whatsapp')}
        >
          <SocialIcon
            network="whatsapp"
            bgColor="#ffffff"
            fgColor="#000000"
            style={{ width: width, height: height }}
          />
        </WhatsappShareButton>
        <FacebookMessengerShareButton
          appId={fbClientID}
          url={window.location.href}
          className="div-img"
          beforeOnClick={() => handleBeforeShare()}
          onShareWindowClose={() => handleShareSuccess('messenger')}
        >
          <img src={icMessenger} alt="ic-mess" width={width} height={height} />
        </FacebookMessengerShareButton>
      </div>
    </div>
  );
}

export default memo(BlockShareSocial);
