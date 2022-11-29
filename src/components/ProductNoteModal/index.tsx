import React, { memo } from 'react';
import Picture from '../Picture';
import scentStrength from '../../images/scent-strength.png';
import scentbg from '../../images/product-note-top-title.png';
import { Link } from 'react-router-dom';

function ProductNoteModal(props: any) {
  const { data } = props;
  return (
    <section className="product-note-modal">
      <div className="content">
        <div className="row">
          {data.image ? (
            <div className="col-md-4 col-12">
              <div className="wrapper-img">
                <Picture data={data.image?.url} />
              </div>
            </div>
          ) : (
            ''
          )}
          <div className={`${data.image ? 'col-md-8' : 'col-md-12'} col-12`}>
            <div className="content-note">
              <h2 className="title">{data?.name}</h2>
              <p>{data?.description}</p>
              <section className="footer-content">
                {data.strength ? (
                  <div className="col-left">
                    <div className="scent-strenght">
                      <div className="wrap-strength">
                        <img loading="lazy" src={scentStrength} alt="" />
                        <div
                          className="fill-percent animated faster level-strength"
                          style={{
                            width: `${
                              data.strength == 0
                                ? 0
                                : data?.strength <= 10
                                ? data?.strength + 5
                                : data?.strength
                            }%`,
                          }}
                        ></div>
                      </div>
                      <h1>{data?.strength}</h1>
                    </div>
                    <h2>SCENT STRENGTH</h2>
                  </div>
                ) : (
                  ''
                )}

                <div
                  className="col-right"
                  style={{ display: data?.type == 'olfactory' ? 'block' : 'none' }}
                >
                  <img src={scentbg} alt="" />
                  <Link to={data?.name ? `/product?scents=${data?.id}` : '/'}>
                    {data?.nof_products} fragrance{data?.nof_products > 2 ? 's' : ''} with{' '}
                    {data?.name}
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ProductNoteModal);
