import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../features/counter/counterSlice";
import { cartSlice } from "../features/cart/cartSlice";
import { baseApi } from "../services/baseApi";
import { authSlice } from "../features/auth/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [counterSlice.reducerPath]: counterSlice.reducer,
      [cartSlice.reducerPath]: cartSlice.reducer,
      [authSlice.reducerPath]: authSlice.reducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};
