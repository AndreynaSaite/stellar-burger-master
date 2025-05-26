import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as generateId } from 'uuid';


type BurgerState = {
  selectedBun: TIngredient | null;
  fillings: TConstructorIngredient[];
};


const defaultBurgerState: BurgerState = {
  selectedBun: null,
  fillings: []
};

const CreateBurger = createSlice({
    name: 'CreateBurger',
    initialState: defaultBurgerState,
    reducers: {
        takeBun(status, effect: PayloadAction<TIngredient | null>) {
            status.selectedBun = effect.payload;
        },
        addFillings: {
            prepare(fillings: TIngredient){
                return {
                    payload: {
                        _id: fillings._id,
                        name: fillings.name,
                        type: fillings.type,
                        proteins: fillings.proteins,
                        fat: fillings.fat,
                        carbohydrates: fillings.carbohydrates,
                        calories: fillings.calories,
                        price: fillings.price,
                        image: fillings.image,
                        image_large: fillings.image_large,
                        image_mobile: fillings.image_mobile,
                        id: generateId()
                    }
                };
            },
            reducer(status, effect: PayloadAction<TConstructorIngredient>){
                if (effect.payload.type === 'bun'){
                    status.selectedBun = effect.payload;
                } else {
                    status.fillings.push(effect.payload)
                }
            }
        },
        deleteFillings(status, effect: PayloadAction<string>){
            status.fillings = status.fillings.filter(item => item.id !== effect.payload)
        },
        reorderFilling(status, effect: PayloadAction<{ index: number; moveUp: boolean }>) {
            const { index, moveUp } = effect.payload;
            const current = status.fillings[index];
            const targetIndex = moveUp ? index - 1 : index + 1;

            if (targetIndex >= 0 && targetIndex < status.fillings.length) {
                [status.fillings[index], status.fillings[targetIndex]] = [
                status.fillings[targetIndex],
                current
                ];
            }
        },
        clearFillings(status){
            status.selectedBun = null
            status.fillings = []
        }
    }      
    
});

export const {takeBun, addFillings, deleteFillings, reorderFilling, clearFillings } = CreateBurger.actions;
export const reducer = CreateBurger.reducer;