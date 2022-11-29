import React, { memo } from 'react';
import PropTypes from 'prop-types';
import thumb from '../../images/thump-video-example.png';
import { API_URL } from '../../config';
import Picture from '../Picture';
import { Link } from 'react-router-dom';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import '@slightlyoff/lite-vimeo';

function BlockVideo({
  data = {},
  title = '',
  showReadmore = false,
}: {
  data: any;
  title: string;
  showReadmore: boolean;
}) {
  return data && data.video ? (
    <section className="blk-video">
      <div className="container">
        {title ? <h3 className="title-block">{title}</h3> : ''}
        <div className="row">
          <div className="col-lg-7 col-md-12 col-12 p-0">
            <div className="wrapper-video">
              {data?.video?.id ? (
                data?.video?.publisher === 'vimeo' ? (
                  <div
                    className="video-vimeo"
                    dangerouslySetInnerHTML={{
                      __html: `<lite-vimeo videoid="${data?.video?.id}" style="width: 100%; height: 100%;"></lite-vimeo>`,
                    }}
                  ></div>
                ) : (
                  <LiteYouTubeEmbed
                    id={data?.video?.id}
                    title={data?.video?.placeholder || ''}
                    activatedClass="lyt-activated"
                    playerClass="lty-playbtn"
                    wrapperClass="yt-lite"
                  />
                )
              ) : data.video.file ? (
                <video
                  src={`${API_URL + data.video.file.url}`}
                  controls
                  poster={thumb}
                ></video>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="col-lg-5 col-md-12 col-12 p-0">
            <div className="content-video">
              <div className="content">
                <div className="logo">
                  {data?.logo?.original ? <Picture data={data?.logo} /> : ''}
                </div>
                <h2 dangerouslySetInnerHTML={{ __html: data.text }}></h2>
                {showReadmore && (data?.link || data?.product) ? (
                  <Link
                    to={
                      data?.link && data?.link?.relative_url
                        ? `${data?.link?.relative_url}`
                        : data?.product
                        ? `/brand/${data?.product?.brand_page?.page_ptr?.handle}/${data?.product.handle}`
                        : '/'
                    }
                  >
                    {data?.link && data?.link?.relative_url
                      ? `Read now`
                      : data?.product
                      ? 'Shop now'
                      : ''}
                  </Link>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <></>
  );
}

BlockVideo.propTypes = {
  item: PropTypes.object,
};

export default memo(BlockVideo);
