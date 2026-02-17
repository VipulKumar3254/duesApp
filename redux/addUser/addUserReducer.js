import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    name:"vipul",
    address:"gyaspur",
    phone:"8307949189",
    profile:"https://plus.unsplash.com/premium_photo-1661304704888-542933309d4a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

}
const addUserReducer= createSlice({
    name:"addUser",
    initialState,
    reducers:{
        addUser:(state,action)=>{
            state=state;
        }
    }
})