import {
  reducer,
  addFillings,
  takeBun,
  deleteFillings,
  reorderFilling,
  clearFillings
} from './burgerSlice';
import { v4 as uuidv4 } from 'uuid';
import { TIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid')
}));

const mockIngredient: TIngredient = {
  _id: 'ingredient1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 2,
  calories: 100,
  price: 50,
  image: 'test.jpg',
  image_large: 'test_large.jpg',
  image_mobile: 'test_mobile.jpg'
};

const mockBun: TIngredient = {
  ...mockIngredient,
  type: 'bun',
  _id: 'bun1',
  name: 'Test Bun'
};

describe('CreateBurger reducer', () => {
  it('возврат initialState по умолчанию', () => {
    const state = reducer(undefined, { type: '' });
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  it('установка булки при takeBun', () => {
    const state = reducer(undefined, takeBun(mockBun));
    expect(state.bun).toEqual(mockBun);
  });

  it('добавление начинки с уникальным id при addFillings', () => {
    const state = reducer(undefined, addFillings(mockIngredient));
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0]).toMatchObject({
      ...mockIngredient,
      id: 'mocked-uuid'
    });
  });

  it('должен добавлять булку вместо обычного ингредиента, если type === "bun"', () => {
    const state = reducer(undefined, addFillings(mockBun));
    expect(state.bun).toMatchObject({
      ...mockBun,
      id: 'mocked-uuid'
    });
    expect(state.ingredients.length).toBe(0);
  });

  it('удалять начинку по id', () => {
    const stateWithIngredient = {
      bun: null,
      ingredients: [{ ...mockIngredient, id: 'remove-me' }]
    };
    const newState = reducer(stateWithIngredient, deleteFillings('remove-me'));
    expect(newState.ingredients.length).toBe(0);
  });

  it('перемещать начинку вверх', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        { ...mockIngredient, id: '1' },
        { ...mockIngredient, id: '2' }
      ]
    };
    const newState = reducer(
      stateWithIngredients,
      reorderFilling({ index: 1, moveUp: true })
    );
    expect(newState.ingredients[0].id).toBe('2');
  });

  it('очистка всего', () => {
    const filledState = {
      bun: mockBun,
      ingredients: [{ ...mockIngredient, id: '1' }]
    };
    const newState = reducer(filledState, clearFillings());
    expect(newState).toEqual({ bun: null, ingredients: [] });
  });
});
