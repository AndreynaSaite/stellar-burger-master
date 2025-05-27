import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as generateId } from 'uuid';

type BurgerState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const defaultBurgerState: BurgerState = {
  bun: null,
  ingredients: []
};

const CreateBurger = createSlice({
  name: 'CreateBurger',
  initialState: defaultBurgerState,
  reducers: {
    takeBun(status, effect: PayloadAction<TIngredient | null>) {
      status.bun = effect.payload;
    },
    addFillings: {
      prepare(ingredients: TIngredient) {
        return {
          payload: {
            _id: ingredients._id,
            name: ingredients.name,
            type: ingredients.type,
            proteins: ingredients.proteins,
            fat: ingredients.fat,
            carbohydrates: ingredients.carbohydrates,
            calories: ingredients.calories,
            price: ingredients.price,
            image: ingredients.image,
            image_large: ingredients.image_large,
            image_mobile: ingredients.image_mobile,
            id: generateId()
          }
        };
      },
      reducer(status, effect: PayloadAction<TConstructorIngredient>) {
        if (effect.payload.type === 'bun') {
          status.bun = effect.payload;
        } else {
          status.ingredients.push(effect.payload);
        }
      }
    },
    deleteFillings(status, effect: PayloadAction<string>) {
      status.ingredients = status.ingredients.filter(
        (item) => item.id !== effect.payload
      );
    },
    reorderFilling(
      status,
      effect: PayloadAction<{ index: number; moveUp: boolean }>
    ) {
      const { index, moveUp } = effect.payload;
      const current = status.ingredients[index];
      const targetIndex = moveUp ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < status.ingredients.length) {
        [status.ingredients[index], status.ingredients[targetIndex]] = [
          status.ingredients[targetIndex],
          current
        ];
      }
    },
    clearFillings(status) {
      status.bun = null;
      status.ingredients = [];
    }
  }
});

export const {
  takeBun,
  addFillings,
  deleteFillings,
  reorderFilling,
  clearFillings
} = CreateBurger.actions;

export const reducer = CreateBurger.reducer;
