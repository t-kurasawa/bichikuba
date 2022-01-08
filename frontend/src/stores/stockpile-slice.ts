import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { search, SearchCondition } from 'apis/stockpile-api';

import { Stockpile } from 'schema';

const STORE_NAME = 'stockpile';

export interface StockpilesState {
  status: 'idle' | 'loading' | 'failed';
  stockpileList: Array<Stockpile>;
}

const initialState: StockpilesState = {
  status: 'idle',
  stockpileList: [
    {
      id: 1,
      name: '',
      user: {
        id: {
          name: '',
          value: '',
        },
        name: {
          title: '',
          first: '',
          last: '',
        },
        gender: '',
        picture: {
          large: '',
          medium: '',
          thumbnail: '',
        },
        email: '',
      },
      stockQuantity: 1,
      lat: 35.666452,
      lng: 139.31582,
      address: '',
      registrationDate: '',
      expiryDate: '',
    },
  ],
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const stockpileSearchAsync = createAsyncThunk(
  STORE_NAME + '/search',
  async (condition: SearchCondition) => {
    const response = await search(condition);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const StockPileSlice = createSlice({
  name: STORE_NAME,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(stockpileSearchAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(stockpileSearchAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.stockpileList = action.payload.data;
      })
      .addCase(stockpileSearchAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const selectStockPile = (state: RootState) => state.stockpile;

export default StockPileSlice.reducer;