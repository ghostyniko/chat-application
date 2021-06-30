import { createSlice } from '@reduxjs/toolkit'

export const usersSlice = createSlice({
    name:'messages',
    initialState:{
        users:[]
    },
    reducers:{
        join: (state,action)=>{
            state.users = state.users.concat(action.payload);
        },
        leave:(state,action)=>{
            state.users = state.users.filter(user=>user.id!==action.payload.id);
        }
    }
})

export const {join,leave} = usersSlice.actions;

export default usersSlice.reducer;