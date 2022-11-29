import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { SHOPIFY_DOMAIN } from '../../config';
function BlockInstagram({ widgetId }: { widgetId: any }) {
  const [isLazy, setIsLazy] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLazy(true);
    }, 5000);
  }, []);
  return (
    <section className="blk-instagram">
      {isLazy ? (
        <>
          <Helmet>
            <link href="/assets/css/social-widget.min.css" rel="stylesheet" />
            <script src="/assets/js/social-widget.min.js"></script>
          </Helmet>
          <div className="social-widget-wrapper" data-widget-id={widgetId}></div>
          <input type="hidden" id="social-widget-shop-domain" value={SHOPIFY_DOMAIN} />
        </>
      ) : (
        ''
      )}
    </section>
  );
}

BlockInstagram.propTypes = {
  widgetId: PropTypes.any,
};

export default memo(BlockInstagram);
