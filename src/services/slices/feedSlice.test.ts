import { configureStore } from '@reduxjs/toolkit';
import { reducer as feedReducer, loadFeed } from './feedSlice';

describe('feedSlice', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        feed: feedReducer
      }
    });

  it('флаг загрузки при pending', () => {
    const store = createStore();
    store.dispatch({ type: loadFeed.pending.type });
    const state = store.getState().feed;
    expect(state.loading).toBe(true);
    expect(state.failure).toBeNull();
  });

  it('установка ошибки при rejected', () => {
    const store = createStore();
    const testError = { message: 'Ошибка загрузки' };
    store.dispatch({
      type: loadFeed.rejected.type,
      error: testError
    });
    const state = store.getState().feed;
    expect(state.loading).toBe(false);
    expect(state.failure?.message).toBe(testError.message);
  });

  it('сохранение данных при fulfilled', () => {
    const store = createStore();
    const payload = {
      orders: [
        {
          _id: 'order123',
          ingredients: ['1', '2'],
          status: 'done',
          name: 'Test Burger',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          number: 1
        }
      ],
      total: 100,
      totalToday: 10
    };
    store.dispatch({ type: loadFeed.fulfilled.type, payload });
    const state = store.getState().feed;
    expect(state.loading).toBe(false);
    expect(state.failure).toBeNull();
    expect(state.content).toEqual(payload);
  });
});
