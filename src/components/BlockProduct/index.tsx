import React, { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ItemProduct from './itemProduct';
import { map } from 'lodash';
import ProductDetailModal from '../ProductDetail/modal';
import { fetchClient, toastrSuccess } from '../../redux/Helpers';
import { GET_PRODUCT_DETAIL, GET_WISHLIST } from '../../config';
import Modal from 'react-modal';
import ProductNoteModal from '../ProductNoteModal';
import { useDispatch } from 'react-redux';
import * as action from '../../redux/auth/actions';
import LEFTARROW from '../../images/icons/chevron-left-solid.svg';
import RIGHTARROW from '../../images/icons/chevron-right-solid.svg';
// import DotLoader from '../DotLoader';

function BlockProduct({
  productList,
  title,
  isInHomePage = false,
  hasScrollButtons = false,
}: {
  productList: any;
  title: string;
  isInHomePage?: boolean;
  hasScrollButtons?: boolean;
}) {
  const scrollAmount = 500;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const [visibleModalDetail, setVisibleModalDetail] = useState<boolean>(false);
  const [dataProductDetail, setDataProductDetail] = useState<any>({});
  const [dataProductInventory, setDataProductInventory] = useState<any>({});

  const [visibleModalNote, setVisibleModalNote] = useState<boolean>(false);
  const [dataNoteModal, setDataNoteModal] = useState<any>([]);

  const [visibleModalOutStock, setVisibleModalOutStock] = useState<boolean>(false);

  const scrl = useRef<HTMLDivElement>(null);
  const [scrollX, setscrollX] = useState(0);
  const [scrolEnd, setscrolEnd] = useState(false);

  const slide = (shift: number) => {
    if (scrl.current) {
      scrl.current.scrollLeft += shift;
      setscrollX(scrollX + shift);

      if (
        Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
        scrl.current.offsetWidth
      ) {
        setscrolEnd(true);
      } else {
        setscrolEnd(false);
      }
    }
  };

  const scrollCheck = () => {
    if (scrl.current) {
      setscrollX(scrl.current.scrollLeft);
      if (
        Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
        scrl.current.offsetWidth
      ) {
        setscrolEnd(true);
      } else {
        setscrolEnd(false);
      }
    }
  };

  const handleModalProduct = async (product: any) => {
    const productUrl: string = product.handle;
    setLoading(true);
    const options = {
      url: `${GET_PRODUCT_DETAIL}${productUrl}/quick-view/`,
      method: 'GET',
      body: null,
    };
    const optionsInventory = {
      url: `${GET_PRODUCT_DETAIL}${productUrl}/inventory/`,
      method: 'POST',
      body: null,
    };
    fetchClient(optionsInventory).then((res: any) => {
      if (res?.success) {
        setDataProductInventory(res.data);
      }
    });

    const pending = [fetchClient(options)];
    try {
      const results = await Promise.all(pending);
      const dataProduct = results[0];
      setDataProductDetail(dataProduct);
      setVisibleModalDetail(true);
      setLoading(false);
    } catch (error) {
      // toastrError(error.message);
      // this.props.loadingPage(false);
    }
  };

  const handleToggleModal = (data: any) => {
    setDataNoteModal(data);
    setVisibleModalNote(!visibleModalNote);
  };
  const handleAddToWishList = () => {
    if (!localStorage.getItem('sundoraToken')) {
      localStorage.setItem('product_wishlist_id', dataProductDetail?.id);
      dispatch(action.toggleModalLoginActions(true));
      return;
    }
    const options = {
      url: `${GET_WISHLIST}/`,
      method: 'POST',
      body: {
        product_id: dataProductDetail?.id || null,
      },
    };
    fetchClient(options).then((res) => {
      if (res.success) {
        toastrSuccess(res?.message);
      }
    });
  };

  return (
    <section className="blk-product">
      {loading ? '' : ''}
      <div className="container">
        {/* <div className="curl"></div> */}
        {title ? <h3 className="title-block">{title}</h3> : ''}
        {scrollX !== 0 && hasScrollButtons && productList.length > 4 && (
          <img
            className="icon prev-icon"
            onClick={() => slide(-scrollAmount)}
            src={LEFTARROW}
            alt="left"
          />
        )}
        <div ref={scrl} onScroll={scrollCheck} className="row list-product">
          {map(productList, (item: any, index: number) => (
            <div
              className="col-md-3 col-12 animated fasted fade-in product-wrapper"
              key={index}
            >
              <ItemProduct
                isInHomePage={isInHomePage}
                productItem={item}
                handleModalProduct={handleModalProduct}
              />
            </div>
          ))}
        </div>
        {!scrolEnd && hasScrollButtons && productList.length > 4 && (
          <img
            className="icon next-icon"
            onClick={() => slide(+scrollAmount)}
            src={RIGHTARROW}
            alt="left"
          />
        )}
        {/* Product detail modal */}
        {visibleModalDetail ? (
          <Modal
            isOpen={visibleModalDetail}
            ariaHideApp={false}
            onRequestClose={() => setVisibleModalDetail(false)}
            style={{ overlay: { zIndex: 99, background: 'rgba(0, 0, 0, 0.35)' } }}
            className="modal-quick-view__content"
          >
            <ProductDetailModal
              handleOpenModalNote={handleToggleModal || null}
              handleModalClose={() => setVisibleModalDetail(false)}
              handleOutStockProduct={() => setVisibleModalOutStock(true)}
              data={dataProductDetail}
              inventory={dataProductInventory}
              defaultVariant={
                dataProductDetail?.product_variants &&
                dataProductDetail?.product_variants.length > 0
                  ? dataProductDetail?.product_variants[0]
                  : {}
              }
              isWishListChecked={dataProductDetail?.wishlist?.checked}
            />
          </Modal>
        ) : (
          ''
        )}

        {/* Product scents modal */}
        {visibleModalNote ? (
          <Modal
            isOpen={visibleModalNote}
            ariaHideApp={false}
            onRequestClose={() => handleToggleModal(null)}
            style={{ overlay: { zIndex: 99, background: 'rgba(0, 0, 0, 0.35)' } }}
            className="modal-scent-view__content"
          >
            <div className="col-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-close"
                type="button"
                onClick={() => handleToggleModal(null)}
              ></button>
            </div>
            <ProductNoteModal data={dataNoteModal} />
          </Modal>
        ) : (
          ''
        )}

        {/* Product out stock modal */}
        {visibleModalOutStock ? (
          <Modal
            isOpen={visibleModalOutStock}
            ariaHideApp={false}
            onRequestClose={() => setVisibleModalOutStock(false)}
            style={{ overlay: { zIndex: 99, background: 'rgba(0, 0, 0, 0.35)' } }}
            className="modal-outstock-view__content"
          >
            <div className="box-warning">
              <div className="col-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-close"
                  type="button"
                  onClick={() => setVisibleModalOutStock(false)}
                ></button>
              </div>
              <div className="box-content">
                <p className="warning">Warning</p>
                <p className="description">
                  Sorry! This product is out of stock, click on the button below to get
                  notified when it is back!
                </p>
                <button className="btn-add-to-wishlist" onClick={handleAddToWishList}>
                  Notify me
                </button>
              </div>
            </div>
          </Modal>
        ) : (
          ''
        )}
      </div>
    </section>
  );
}
BlockProduct.propTypes = {
  productList: PropTypes.array,
  title: PropTypes.string,
};

export default memo(BlockProduct);
