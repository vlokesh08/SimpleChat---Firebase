import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // defaults to localStorage for web
import rootReducer from './Slice/rootReducer';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const mainReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: mainReducer,
  // Consider adding middleware here if needed, e.g., thunk
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {
        serializableCheck: false,
    }
  )
});

export const persistor = persistStore(store);
export default store;
