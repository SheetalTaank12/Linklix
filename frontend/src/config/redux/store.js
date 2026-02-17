import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducer/authReducer';
import postReducer from './reducer/postReducer';

/**
 * Steps for state management in redux
 * 
 * Submit Action
 * Handle Action in its reducer
 * every action has a corresponding reducer
 * 
 * Register the reducer here in storage
 */


export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer


    }
})

// Now the store is configured with auth and post reducers
// You can now dispatch actions related to authentication and posts
// and the state will be managed by the respective reducers.

// Frontend backend se communicate karta hai through actions (createAsyncThunk) 
// jahan data send aur receive hota hai. Backend response dene ke baad, reducers 
// us response ke base par application state update karte hain, aur wahi updated 
// state UI ko update karti hai.