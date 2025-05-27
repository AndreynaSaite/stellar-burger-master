import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';
import { submitOrder } from './slices/orderSlice';
import { clearFillings } from './slices/burgerSlice';

export const ordersMiddleware: Middleware =
  (store: MiddlewareAPI<AppDispatch, RootState>) => (next) => (action) => {
    if (submitOrder.fulfilled.match(action)) {
      store.dispatch(clearFillings());
    }
    return next(action);
  };
