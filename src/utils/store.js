// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import blogReducer from "./blogSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
  },
});
