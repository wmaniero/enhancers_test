import { createStore, applyMiddleware } from 'redux';
import loggingMiddleware from './loggingMiddleware';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../_reducers';

import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
    blacklist: [],
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, (__DEV__) ? 
    applyMiddleware(thunkMiddleware, loggingMiddleware) : 
    applyMiddleware(thunkMiddleware)
);
export const persistor = persistStore(store);
