// import { applyMiddleware, createStore } from 'redux';
// import createSagaMiddleware from 'redux-saga';
// import rootReducer from './root-reducer';
// import rootSaga from './root-saga';

// const sagaMiddleware = createSagaMiddleware();
// const middlewares = [sagaMiddleware];

// const configureStore = () => {
//   const store = createStore(rootReducer, applyMiddleware(...middlewares));
//   sagaMiddleware.run(rootSaga);
//   console.log(store);
//   return store;
// };

// export default configureStore;

import { createStore, applyMiddleware } from 'redux';

import createSagaMiddleware from 'redux-saga';
import rootReducer from './root-reducer';
import rootSaga from './root-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];

  const bindMiddleware = (middleware: any) => {
    if (process.env.NODE_ENV !== 'production') {
      // const { composeWithDevTools } = require('redux-devtools-extension');
      return composeWithDevTools(applyMiddleware(...middleware));
    }
    return applyMiddleware(...middleware);
  };

  return {
    ...createStore(rootReducer, bindMiddleware(middlewares)),
    runSaga: sagaMiddleware.run(rootSaga),
  };
};
export default configureStore;
