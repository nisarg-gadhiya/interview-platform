import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import oaReducer from "./oaSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    oa: oaReducer,
  },
});

export default store;