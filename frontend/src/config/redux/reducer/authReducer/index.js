import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, loginUser, registerUser } from "../../action/authAction";


const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: true,
    loggedIn: false,
    message: "",
    isTokenThere:false,
    profileFetched : false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetching: false
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: ()=> initialState,
        handleLoginUser: (state)=>{
            state.message= "hello"
        },
        emptyMessage : (state) =>{
            state.message=""
        },
        setTokenIsThere: (state)=>{
            state.isTokenThere= true
        },
        setTokenIsNotThere: (state)=>{
            state.isTokenThere= false
        }
    },

    extraReducers: (builder)=>{
        builder
        .addCase(loginUser.pending, (state)=>{
            state.isLoading = true,
            state.message= "knocking the door..."
        })
        .addCase(loginUser.fulfilled,(state, action)=>{
            state.isLoading= false,
            state.isError= false,
            state.isSuccess= true,
            state.loggedIn= true,
            message= "Login is successful"
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading= false,
            state.isError= true,
            state.message= action.payload
        })
        .addCase(registerUser.pending,(state)=>{
            state.isLoading=true,
            state.message="Registering you..."
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.isError= false,
            state.isSuccess= true,
            state.loggedIn= true,
            state.message= {
                message:"Registered successfully. Please login"}
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading= false,
            state.isError= true,
            state.message=action.payload
        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.isError= false,
            state.profileFetched= true,
            state.user= action.payload.profile
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading= false,
            state.isError= false,
            state.all_users= action.payload.profiles
        })
    }
});


export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer;