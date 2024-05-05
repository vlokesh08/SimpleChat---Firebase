import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  user: {
    id: string;
    username: string;
    fullName: string;
    pic: string;
  };
}

const initialState: UserState = {
  user: {
    id: '',
    username: '',
    fullName: '',
    pic: '',
  },
};

const userSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { username, uid, name, picture } = action.payload;
      state.user.id = uid;
      state.user.username = username;
      state.user.fullName = name;
      state.user.pic = picture;
    },
    updateUser : (state, action) => { 
      const { username, name, pic } = action.payload;
      state.user.username = username;
      state.user.fullName = name;
      state.user.pic = pic;
    },
    loginFailure: (state) => {
      state.user = initialState.user;
    },
    logout: (state) => {
      state.user = initialState.user;
    },
  },
});

export const {  loginSuccess, loginFailure, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
