import store from './store';
import { reducer as user } from './slices/userSlice';
import { reducer as order } from './slices/orderSlice';
import { reducer as builder } from './slices/burgerSlice';
import { reducer as feeds } from './slices/feedSlice';
import { reducer as ingredients } from './slices/ingridientsSlice';

describe('Redux Store', () => {
  it('инициализация с ожидаемыми редбюсерами', () => {
    const state = store.getState();

    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('builder');
    expect(state).toHaveProperty('feeds');
  });

  it('диспатч фиктивного действия не должен вызывать ошибок ', () => {
    const dummyAction = { type: 'DUMMY_ACTION' };

    expect(() => {
      store.dispatch(dummyAction);
    }).not.toThrow();
  });
});
