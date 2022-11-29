import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import './wish-list.scss';
import Picture from '../Picture';
import expandIc from '../../images/icons/expand.svg';
import closeIc from '../../images/icons/close-small.svg';
import { fetchClient, moneyFormater } from '../../redux/Helpers';
import { GET_WISHLIST } from '../../config';
import { map } from 'lodash';
import { useHistory } from 'react-router';
interface Item {
  id: string;
  content: string;
}
// fake data generator
const getItems = (count: number): Item[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
): React.CSSProperties => ({
  userSelect: 'none',
  padding: `16px 0`,
  borderBottom: '1px solid #cccccc',
  margin: `0`,

  // change background colour if dragging
  background: 'white',
  boxShadow: isDragging ? '0px 3px 5px #e8e7e7' : '',

  // styles we need to apply on draggables
  ...draggableStyle,
});
// isDraggingOver: boolean
const getListStyle = (): React.CSSProperties => ({
  width: '100%',
});

const WishList = (): JSX.Element => {
  const [state, setState] = useState(getItems(0));
  const [id, setID] = useState<any>(null);

  // a little function to help us with reordering the result
  const reorder = (list: Item[], startIndex: number, endIndex: number): Item[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const dataBody = map(result, (item: any, index) => {
      return {
        id: item?.content.id,
        ordinal_number: index + 1,
      };
    });
    const options = {
      url: `${GET_WISHLIST}/${id}/`,
      method: 'PUT',
      body: { products: dataBody },
    };
    fetchClient(options);
    return result;
  };

  const onDragEnd = (result: DropResult): void => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    if (state) {
      const items: Item[] = reorder(state, result.source.index, result.destination.index);

      setState(items);
    }
  };
  useEffect(() => {
    const options = {
      url: `${GET_WISHLIST}/`,
      method: 'GET',
      body: null,
    };
    fetchClient(options).then((res) => {
      if (res.success) {
        // let cloneState = [...state];
        // console.log(res?.data?.products);
        let cloneState = [...state];
        setID(res?.data?.id);
        map(res?.data?.products, (item, index) => {
          const itemCustom = [
            {
              id: `item-${index}`,
              content: item,
            },
          ];
          cloneState = [...cloneState, ...itemCustom];
        });
        setState(cloneState);
      }
    });
  }, []);
  const handleDelete = (item: any) => {
    // console.log(item);
    const options = {
      url: `${GET_WISHLIST}/`,
      method: 'DELETE',
      body: {
        product_id: item?.content?.id || null,
      },
    };
    fetchClient(options).then((res) => {
      if (res.success) {
        // let cloneState = [...state];
        setID(res?.data?.id);
        const newArr = map(res?.data?.products, (item, index) => {
          return {
            id: `item-${index}`,
            content: item,
          };
        });
        setState([...newArr]);
      }
    });
  };
  const history = useHistory();
  const directDetailProduct = (handle: any, brandName: any) => {
    history.push('/brand/' + brandName + '/' + handle);
  };

  const renderEmpty = () => {
    return (
      <div className={'row-item row'}>
        <div className="col-12 no-products">No products found in wish list!</div>
      </div>
    );
  };

  const renderDragDrop = () => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {/* (provided, snapshot) */}
          {(provided): JSX.Element => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              // snapshot.isDraggingOver
              style={getListStyle()}
            >
              {map(state, (item: any, index: number) => {
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot): JSX.Element => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        )}
                      >
                        {/* {item.content} */}
                        <div
                          className={`row-item row ${snapshot.isDragging ? 'dragging' : ''}`}
                        >
                          <div className="col-1 info">
                            <img src={expandIc} alt="" className="expand-ic" />
                          </div>
                          <div
                            className="col-2"
                            onClick={() =>
                              directDetailProduct(
                                item?.content.handle,
                                item?.content?.brand_page?.page_ptr?.handle,
                              )
                            }
                          >
                            <div className="wrapper-img">
                              {item?.content?.images && item?.content?.images.length > 0 ? (
                                <Picture data={item?.content?.images[0]?.url} />
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                          <div
                            className="col-5 info"
                            onClick={() =>
                              directDetailProduct(
                                item?.content.handle,
                                item?.content?.brand_page?.page_ptr?.handle,
                              )
                            }
                          >
                            <h4>{item?.content?.name}</h4>
                            <p>{item?.content?.brand?.name}</p>
                          </div>
                          <div
                            className="col-4 price-info"
                            onClick={() =>
                              directDetailProduct(
                                item?.content.handle,
                                item?.content?.brand_page?.page_ptr?.handle,
                              )
                            }
                          >
                            {item?.content?.product_variants &&
                            item?.content?.product_variants.length > 0 ? (
                              <h3>
                                {moneyFormater(item?.content?.product_variants[0]?.price)}
                              </h3>
                            ) : (
                              ''
                            )}
                            {/* <span className="sale-inf">-10%</span> */}
                          </div>
                          <button onClick={() => handleDelete(item)} className="close-ic">
                            <img src={closeIc} alt="" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };
  return (
    <section className="tab-WishList animated faster fadeIn">
      <h1>MY WISH LIST</h1>
      <div className="head row">
        <div className="col-1"></div>
        <div className="col-2">
          <p>Product</p>
        </div>
        <div className="col-5"></div>
        <div className="col-4">
          <p>Price</p>
        </div>
      </div>
      {state.length ? renderDragDrop() : renderEmpty()}
    </section>
  );
};

export default WishList;
