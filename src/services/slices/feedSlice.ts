import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrdersData } from '@utils-types';

// Тип состояния ленты заказов
type FeedState = {
  loading: boolean;
  failure: SerializedError | null;
  content: TOrdersData;
};

// Начальное состояние
const defaultFeedState: FeedState = {
  loading: true,
  failure: null,
  content: {
    orders: [],
    total: Number.NaN,
    totalToday: Number.NaN
  }
};

export const loadFeed = createAsyncThunk('feed/load', async function () {
  const response = await getFeedsApi();
  return response;
});

// Срез Redux
const feedSlice = createSlice({
  name: 'feed/order',
  initialState: defaultFeedState,
  reducers: {},
  extraReducers: function (builder) {
    builder.addCase(loadFeed.pending, function (status) {
      status.loading = true;
      status.failure = null;
    });
    builder.addCase(loadFeed.fulfilled, function (status, effect) {
      status.loading = false;
      status.failure = null;
      status.content = effect.payload;
    });
    builder.addCase(loadFeed.rejected, function (status, effect) {
      status.loading = false;
      status.failure = effect.error;
    });
  }
});

export const reducer = feedSlice.reducer;
