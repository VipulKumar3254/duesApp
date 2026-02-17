import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./theme/themeReducer"
const store = configureStore({
    reducer:{
        theme:themeReducer
    }
    

})
export default store;

