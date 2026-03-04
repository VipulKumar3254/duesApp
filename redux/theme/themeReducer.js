import { createSlice } from "@reduxjs/toolkit";

const initialState= {
      //here false resembles light mode

    theme:false
};
const themeSlice = createSlice({
    name:"theme",
    initialState,
    reducers:{
        changeTheme:(state,action)=>{
            state.theme=action.payload;
        }
    }
})

export default themeSlice.reducer;
export const {changeTheme} = themeSlice.actions;