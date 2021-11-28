import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { search, SearchCondition } from '../apis/randomuser-api';

const STORE_NAME = 'randomuser';

export interface RandomUser {
  id: {
    name: string,
    value: string
  };
  name: {
    title: string,
    first: string,
    last: string,
  };
  gender: string;
  picture: {
    large: string,
    medium: string,
    thumbnail: string
  },
  email: string;
}

export interface RandomUserState {
  status: 'idle' | 'loading' | 'failed';
  users: Array<RandomUser>
}

const initialState: RandomUserState = {
  status: 'idle',
  users: [{
    id: {
      name: 'PPS',
      value: '0390511T'
    },
    name: {
      title: 'mr',
      first: 'brad',
      last: 'gibson',
    },
    gender: 'male',
    picture: {
      large: 'https://randomuser.me/api/portraits/men/75.jpg',
      medium: 'https://randomuser.me/api/portraits/med/men/75.jpg',
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/75.jpg'
    },
    email: 'brad.gibson@example.com'
  }]

};


// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const searchAsync = createAsyncThunk(
  STORE_NAME + '/search',
  async (condition:SearchCondition) => {
    const response = await search(condition);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const randomUserSlice = createSlice({
  name: STORE_NAME,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
  } ,
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(searchAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.users = action.payload.users;
      })
      .addCase(searchAsync.rejected, (state) => {
        state.status = 'failed';
      })
  },
});


export const selectUsers = (state: RootState) => state.randomuser.users;

export default randomUserSlice.reducer;

