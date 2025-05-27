import { configureStore, AnyAction } from '@reduxjs/toolkit';
import {
  reducer as ingredientsReducer,
  fetchIngredients
} from './ingridientsSlice';
import { TIngredient } from '@utils-types';

const createTestStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsReducer
    }
  });

describe('ingredientSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('выставить isLoading в true и error в null при fetchIngredients.pending', () => {
    store.dispatch({ type: fetchIngredients.pending.type });
    const state = store.getState().ingredients;
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохранить ошибку и выключить isLoading при fetchIngredients.rejected', () => {
    const fakeError = 'Ошибка при загрузке';
    store.dispatch({
      type: fetchIngredients.rejected.type,
      error: { message: fakeError }
    } as AnyAction);
    const state = store.getState().ingredients;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(fakeError);
  });

  it('сохранить данные и выключить isLoading при fetchIngredients.fulfilled', () => {
    const mockData: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка космическая',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 200,
        price: 100,
        image: 'image.jpg',
        image_mobile: 'image_mobile.jpg',
        image_large: 'image_large.jpg'
      }
    ];
    store.dispatch({
      type: fetchIngredients.fulfilled.type,
      payload: mockData
    });
    const state = store.getState().ingredients;
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.data).toEqual(mockData);
  });
});
