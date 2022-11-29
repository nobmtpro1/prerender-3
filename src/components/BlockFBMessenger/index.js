import React, { memo, useEffect, useState } from 'react';
import { LiveChatLoaderProvider, Messenger } from 'react-live-chat-loader';
import { FACEBOOK_PAGE_CHAT_ID } from '../../config';
import { useHistory } from 'react-router-dom';

function BlockFBMessenger() {
  const excludeRoutes = ['/receipt/'];
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const checkReceipt = history.location.pathname.includes(excludeRoutes[0]);
    setVisible(checkReceipt);
  }, []);
  return (
    <div>
      {!visible ? (
        <LiveChatLoaderProvider provider="messenger" providerKey={FACEBOOK_PAGE_CHAT_ID}>
          <Messenger color="#2a676b" />
        </LiveChatLoaderProvider>
      ) : (
        ''
      )}
    </div>
  );
}

export default memo(BlockFBMessenger);
