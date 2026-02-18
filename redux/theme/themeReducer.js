import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    theme:false
};
const themeSlice = createSlice({
    name:"theme",
    initialState,
    reducers:{
        changeTheme:(state,action)=>{
            console.log(action.payload);
            
            state.theme=action.payload;
        }
    }
})

export default themeSlice.reducer;
export const {changeTheme} = themeSlice.actions;