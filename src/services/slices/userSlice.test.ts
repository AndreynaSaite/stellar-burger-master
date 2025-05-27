import { describe, it, expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { reducer as authReducer, retrieveUser } from './userSlice'; // корректный импорт редьюсера и thunk

const setupStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

describe('Тесты экшенов пользователя (authSlice)', () => {
  describe('Тесты экшена получения данных пользователя (retrieveUser)', () => {
    it('Ожидание ответа после начала загрузки данных пользователя', () => {
      const store = setupStore();
      store.dispatch({ type: retrieveUser.pending.type });
      const state = store.getState();
      // В твоём слайсе в таком состоянии нет isLoading,
      // но authChecked остаётся false, authErrors не меняется
      expect(state.auth.authChecked).toBe(false);
      expect(state.auth.authErrors.login).toBeUndefined();
      expect(state.auth.authErrors.register).toBeUndefined();
    });

    it('Ошибка после неудачного получения данных пользователя', () => {
      const store = setupStore();
      store.dispatch({ type: retrieveUser.rejected.type });
      const state = store.getState();
      // authChecked становится true при ошибке
      expect(state.auth.authChecked).toBe(true);
      // Ошибок в retrieveUser rejected явно нет, authErrors не меняется
      expect(state.auth.authErrors.login).toBeUndefined();
      expect(state.auth.authErrors.register).toBeUndefined();
    });

    it('Успешное получение данных пользователя', () => {
      const mockedUser = {
        email: 'ivan@example.com',
        name: 'Иван Иванов',
      };
      const store = setupStore();
      store.dispatch({
        type: retrieveUser.fulfilled.type,
        payload: mockedUser,
      });
      const state = store.getState();
      expect(state.auth.user).toEqual(mockedUser);
      expect(state.auth.authenticated).toBe(true);
      expect(state.auth.authChecked).toBe(true);
    });
  });
});
