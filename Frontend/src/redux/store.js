import {configureStore} from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    // user: userReducer, 
  },

});
 
export default store;