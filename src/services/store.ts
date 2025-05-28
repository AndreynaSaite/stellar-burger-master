import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { reducer as user } from './slices/userSlice';
import { reducer as order } from './slices/orderSlice';
import { reducer as builder } from './slices/burgerSlice';
import { reducer as feeds } from './slices/feedSlice';
import { reducer as ingredients } from './slices/ingridientsSlice';
import { ordersMiddleware as orderSocketMiddleware } from './middleware';

const rootReducer = combineReducers({
  user,
  order,
  ingredients,
  builder,
  feeds
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(orderSocketMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
