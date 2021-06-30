import { createSlice } from '@reduxjs/toolkit'

export const messagesSlice = createSlice({
    name:'messages',
    initialState:{
        messages:[]
    },
    reducers:{
        receive: (state,action)=>{
            console.log("Primljen payload "+action.payload);
            console.log("Veličina prije "+state.messages.length);
            state.messages = state.messages.concat([action.payload]);
            console.log("Veličina nakon "+state.messages.length);
        }
    }
})

export const {receive} = messagesSlice.actions;

export default messagesSlice.reducer;