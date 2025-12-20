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