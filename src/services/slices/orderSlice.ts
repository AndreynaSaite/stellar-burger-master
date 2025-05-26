import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from "@api";
import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";


type OrdersStatus = {
  loadingOne: boolean;
  loadingList: boolean;
  submitting: boolean;
  currentOrder: TOrder | null;
  failure: SerializedError | null;
  ordersList: TOrder[];
};


const defaultOrderStatus: OrdersStatus = {
  loadingOne: true,
  loadingList: true,
  submitting: false,
  currentOrder: null,
  failure: null,
  ordersList: []
};


export const loadAllOrders = createAsyncThunk(
  'orders/loadAll',
  async () => {
    const result = await getOrdersApi();
    return result;
  }
);

export const submitOrder = createAsyncThunk<
  { order: TOrder; name: string },string[] >
(
  'orders/submit',
  async (ingredients) => {
    const result = await orderBurgerApi(ingredients);
    return {
      order: result.order,
      name: result.name
    };
  }
);

export const loadOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/loadByNumber',
  async (number) => {
    const result = await getOrderByNumberApi(number);
    return result.orders[0];
  }
);



const orderSlice = createSlice({
  name: "order/data",
  initialState: defaultOrderStatus,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrderByNumber.pending, (state) => {
        state.loadingOne = true;
      })
      .addCase(loadOrderByNumber.fulfilled, (state, action) => {
        state.loadingOne = false;
        state.currentOrder = action.payload;
      })
      .addCase(loadOrderByNumber.rejected, (state) => {
        state.loadingOne = false;
      })

      .addCase(loadAllOrders.pending, (state) => {
        state.loadingList = true;
        state.failure = null;
      })
      .addCase(loadAllOrders.fulfilled, (state, action) => {
        state.loadingList = false;
        state.ordersList = action.payload;
      })
      .addCase(loadAllOrders.rejected, (state, action) => {
        state.loadingList = false;
        state.failure = action.error;
      })

      .addCase(submitOrder.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.submitting = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(submitOrder.rejected, (state) => {
        state.submitting = false;
      });
  }
});

export const { clearCurrentOrder } = orderSlice.actions;
export const reducer = orderSlice.reducer;