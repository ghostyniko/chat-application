import {configureStore} from '@reduxjs/toolkit';
import messagesReducer from '../features/messages/messagesSlice';
import usersSlice from '../features/users/usersSlice';

export default configureStore({
    reducer:{
        messages:messagesReducer,
        users: usersSlice,
    }
});