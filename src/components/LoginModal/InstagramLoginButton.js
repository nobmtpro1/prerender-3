import React, { memo } from 'react';
import { SocialIcon } from 'react-social-icons';
import InstagramLogin from '@amraneze/react-instagram-login';
import { toastrError } from '../../redux/Helpers';

function InstagramLoginButton({ handleLoginWithInstagram, clientID, setLoading }) {
  const onFailure = () => {
    // param: err
    setLoading(false);
    toastrError('Login failed');
  };

  return (
    <InstagramLogin
      redirectUri={`${window.location.origin}/`}
      clientId={clientID}
      onSuccess={handleLoginWithInstagram}
      onFailure={onFailure}
      cssClass="null"
      scope="user_profile"
      width={800}
      height={700}
    >
      <SocialIcon
        onClick={() => setLoading(true)}
        network="instagram"
        style={{ height: 60, width: 60 }}
      />
    </InstagramLogin>
  );
}

export default memo(InstagramLoginButton);
