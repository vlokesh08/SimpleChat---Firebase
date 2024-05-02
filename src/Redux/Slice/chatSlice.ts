// chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatId: null,
  lastMessage: null,
  extraData: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatData: (state, action) => {
        // console.log(action.payload);
      state.chatId = action.payload.chatId;
      state.lastMessage = action.payload.lastMessage;
      state.extraData = action.payload.extraData;
    },
    resetChatData: (state) => {
      state.chatId = null;
      state.lastMessage = null;
      state.extraData = null;
    },
  },
});

export const { setChatData, resetChatData } = chatSlice.actions;
export const Uid = (state : any) => state.user.chatId;
export default chatSlice.reducer;