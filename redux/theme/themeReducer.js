import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    theme:"light"
};
const themeSlice = createSlice({
    name:"theme",
    initialState,
    reducers:{
        changeTheme:(state,action)=>{
            state=action.payload;
        }
    }
})

export default themeSlice.reducer;
export const {changeTheme} = themeSlice.actions;