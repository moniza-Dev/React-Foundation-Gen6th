import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalPrice: 0,
  quantity: 1,
  products: []
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log(`===> action: `, action.payload)
      let totalPrice = action.payload.price * state.quantity;
      state.totalPrice += totalPrice;
      state.products.push(action.payload)
      console.log(`==> products`, state.products)
    },

    removeFromCart: (state, action) => {
      let totalPrice = action.payload.priceOut * state.quantity;
      state.totalPrice -= totalPrice;
      state.products.pop(action.payload);
    }
  }
})

export const {addToCart, removeFromCart} = cartSlice.actions;
export default cartSlice.reducer;