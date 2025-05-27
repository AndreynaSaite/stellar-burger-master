import { configureStore } from '@reduxjs/toolkit';
import { reducer as orderReducer, clearCurrentOrder } from './orderSlice';
import { loadOrderByNumber, loadAllOrders, submitOrder } from './orderSlice';

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
    it('установка loadingOne в true при pending', () => {
      store.dispatch({ type: loadOrderByNumber.pending.type });
      const state = store.getState().orderData;
      expect(state.loadingOne).toBe(true);
    });

    it('установка currentOrder при fulfilled', () => {
      const fakeOrder = { number: 1, name: 'Test', ingredients: [] };
      store.dispatch({
        type: loadOrderByNumber.fulfilled.type,
        payload: fakeOrder
      });
      const state = store.getState().orderData;
      expect(state.currentOrder).toEqual(fakeOrder);
      expect(state.loadingOne).toBe(false);
    });

    it('сброс loadingOne при rejected', () => {
      store.dispatch({ type: loadOrderByNumber.rejected.type });
      const state = store.getState().orderData;
      expect(state.loadingOne).toBe(false);
    });
  });

  describe('loadAllOrders thunk', () => {
    it('включение loadingList и сбрасывает ошибку при pending', () => {
      const fakePrevError = { name: 'Error', message: 'Some error' };
      store.dispatch({
        type: loadAllOrders.rejected.type,
        error: fakePrevError
      });
      store.dispatch({ type: loadAllOrders.pending.type });

      const state = store.getState().orderData;
      expect(state.loadingList).toBe(true);
      expect(state.failure).toBe(null);
    });

    it('сохранение полученные заказы при fulfilled', () => {
      const mockOrders = [{ number: 1 }, { number: 2 }];
      store.dispatch({
        type: loadAllOrders.fulfilled.type,
        payload: mockOrders
      });

      const state = store.getState().orderData;
      expect(state.loadingList).toBe(false);
      expect(state.ordersList).toEqual(mockOrders);
    });

    it('сохранение ошибку при rejected', () => {
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
    it('устанавка submitting в true при pending', () => {
      store.dispatch({ type: submitOrder.pending.type });
      const state = store.getState().orderData;
      expect(state.submitting).toBe(true);
    });

    it('устанавка currentOrder и сбрасывает submitting при fulfilled', () => {
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

    it('сбрас submitting при rejected', () => {
      store.dispatch({ type: submitOrder.rejected.type });
      const state = store.getState().orderData;
      expect(state.submitting).toBe(false);
    });
  });

  describe('reducers', () => {
    it('очистка currentOrder при вызове clearCurrentOrder', () => {
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
