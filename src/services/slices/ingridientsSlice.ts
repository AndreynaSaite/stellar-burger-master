import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getIngredientsApi } from "@api";
import { TIngredient } from "@utils-types";

// Тип состояния которое будет храниться в Redux
type StatusIngridient = {
  isLoading: boolean; 
  error: string | null;
  data: TIngredient[];
};

const DefaultIngridientState: StatusIngridient = {
  isLoading: true,
  error: null,
  data: []
};

export const fetchIngredients = createAsyncThunk(
  "ingredients/fetch",
  async () => {
    const result = await getIngredientsApi();
    return result;
  }
);

const ingredientSlice = createSlice({
  name: "ingredients",
  initialState: DefaultIngridientState,
  reducers: {},
  extraReducers: function (builder) {
    builder.addCase(fetchIngredients.pending, function (state) {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchIngredients.fulfilled, function (state, action) {
      state.isLoading = false;
      state.error = null;
      state.data = action.payload; // кладём полученные данные в state
    });
    builder.addCase(fetchIngredients.rejected, function (state, action) {
      state.isLoading = false;
      state.error = action.error.message || "Что-то пошло не так";
    });
  }
});
export const reducer = ingredientSlice.reducer;
