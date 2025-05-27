import { configureStore } from '@reduxjs/toolkit';
import { reducer as orderReducer, clearCurrentOrder } from './orderSlice';
import {
  loadOrderByNumber,
  loadAllOrders,
  submitOrder
} from './orderSlice';

describe('orderSlice', () => {
  let store: ReturnType<typeof createStore>;

  const createStore = () =>
    configureStore({
      reducer: {
        orderData: orderReducer
      }
    });

  beforeEach(() => {
    store = createStore();
  });

  describe('loadOrderByNumber thunk', () => {
    it('sets loadingOne to true on pending', () => {
      store.dispatch({ type: loadOrderByNumber.pending.type });
      const state = store.getState().orderData;
      expect(state.loadingOne).toBe(true);
    });

    it('sets currentOrder on fulfilled', () => {
      const fakeOrder = { number: 1, name: 'Test', ingredients: [] };
      store.dispatch({
        type: loadOrderByNumber.fulfilled.type,
        payload: fakeOrder
      });
      const state = store.getState().orderData;
      expect(state.currentOrder).toEqual(fakeOrder);
      expect(state.loadingOne).toBe(false);
    });

    it('resets loadingOne on rejected', () => {
      store.dispatch({ type: loadOrderByNumber.rejected.type });
      const state = store.getState().orderData;
      expect(state.loadingOne).toBe(false);
    });
  });

  describe('loadAllOrders thunk', () => {
    it('enables loadingList and resets failure on pending', () => {
      const fakePrevError = { name: 'Error', message: 'Some error' };
      store.dispatch({ type: loadAllOrders.rejected.type, error: fakePrevError });
      store.dispatch({ type: loadAllOrders.pending.type });

      const state = store.getState().orderData;
      expect(state.loadingList).toBe(true);
      expect(state.failure).toBe(null);
    });

    it('stores fetched orders on fulfilled', () => {
      const mockOrders = [{ number: 1 }, { number: 2 }];
      store.dispatch({
        type: loadAllOrders.fulfilled.type,
        payload: mockOrders
      });

      const state = store.getState().orderData;
      expect(state.loadingList).toBe(false);
      expect(state.ordersList).toEqual(mockOrders);
    });

    it('stores error on rejected', () => {
      const fakeError = { message: 'Load failed' };
      store.dispatch({
        type: loadAllOrders.rejected.type,
        error: fakeError
      });

      const state = store.getState().orderData;
      expect(state.loadingList).toBe(false);
      expect(state.failure?.message).toBe('Load failed');
    });
  });

  describe('submitOrder thunk', () => {
    it('sets submitting flag to true on pending', () => {
      store.dispatch({ type: submitOrder.pending.type });
      const state = store.getState().orderData;
      expect(state.submitting).toBe(true);
    });

    it('sets currentOrder and clears submitting on fulfilled', () => {
      const payload = {
        order: { number: 999, name: 'Burger X', ingredients: [] },
        name: 'Burger X'
      };
      store.dispatch({
        type: submitOrder.fulfilled.type,
        payload
      });

      const state = store.getState().orderData;
      expect(state.submitting).toBe(false);
      expect(state.currentOrder).toEqual(payload.order);
    });

    it('resets submitting on rejected', () => {
      store.dispatch({ type: submitOrder.rejected.type });
      const state = store.getState().orderData;
      expect(state.submitting).toBe(false);
    });
  });

  describe('reducers', () => {
    it('clears current order when clearCurrentOrder is dispatched', () => {
      const dummyOrder = { number: 123, name: 'Cleared' };
      store.dispatch({
        type: loadOrderByNumber.fulfilled.type,
        payload: dummyOrder
      });

      store.dispatch(clearCurrentOrder());

      const state = store.getState().orderData;
      expect(state.currentOrder).toBeNull();
    });
  });
});
