
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./useSlice";
import chatReducer from "./chatSlice";

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
});

export default rootReducer;