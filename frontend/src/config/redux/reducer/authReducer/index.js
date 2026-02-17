import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, loginUser, registerUser, getAllConnections,getUserFromToken,getConnectionRequests,getUpcomingRequests,deleteConnectionRequest } from "../../action/authAction";


const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: true,
    loggedIn: false,
    message: "",
    isTokenThere:false,
    profileFetched : false,
    connections: [],
    sentConnectionRequests: [],
    receivedConnectionRequests:[],
    all_users: [],
    all_profiles_fetched: false,
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

// reducers:
// “User ne UI me kuch kiya, backend ki zarurat nahi”
// extraReducers:
// “Backend se response aaya, ab state update karo”
// createSlice ke andar hum reducers aur extraReducers dono define kar sakte hain.
// reducers synchronous actions handle karte hain, jabki extraReducers asynchronous actions handle karte hain,
// jo createAsyncThunk se aate hain.
// Isliye, jab hum backend se data fetch karte hain ya koi async operation karte hain,
// toh uske liye hum extraReducers ka use karte hain taaki hum state ko uske response 
// ke hisaab se update kar saken.
// builder ek callback function hai jo extraReducers ko define karta hai.
// builder ek helper object hai (naam hum khud rakhte hain) jo extraReducers me different actions
//  ke liye reducers register karne ke kaam aata hai.

    extraReducers: (builder)=>{
        builder
        .addCase(loginUser.pending, (state)=>{
            console.log("LOGIN PENDING");
            state.isLoading = true,
            state.message= "knocking the door..."
        })
        .addCase(loginUser.fulfilled,(state, action)=>{
            console.log("LOGIN FULFILLED"),
            state.isLoading= false,
            state.isError= false,
            state.isSuccess= true,
            state.loggedIn= true,
            state.profileFetched= false,
            state.user= action.payload.user,
            state.isTokenThere= true,
            state.message= "Login is successful"
        })
        .addCase(loginUser.rejected,(state,action)=>{
            console.log("LOGIN REJECTED"),
            state.isLoading= false,
            state.isError= true,
            state.message = action.payload?.message || "Something went wrong";


            // action.payload wahi data hota hai jo tum rejectWithValue()
            //  (ya fulfillWithValue()) me return karte ho.

            // Yahan state = auth slice ka current state, Redux khud pass karta hai
            // Tum ise manually thunk se pass nahi karte
        })
        .addCase(registerUser.pending,(state)=>{
            console.log("REGISTER PENDING");
            state.isLoading=true,
            state.isSuccess= false,
            state.isError= false,
            state.message="Registering you..."
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            console.log("REGISTER FULFILLED");
            state.isLoading=false,
            state.isError= false,
            state.isSuccess= true,
            state.loggedIn= false,
            state.message= "Registered successfully. Please login"
        })
        .addCase(registerUser.rejected,(state,action)=>{
            console.log("REGISTER REJECTED");
            state.isLoading= false,
            state.isError= true,
            state.message = action.payload?.message || "Something went wrong";

        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.isError= false,
            state.profileFetched= true,
            state.user= action.payload
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading= false,
            state.isError= false,
             state.all_users= action.payload,
            state.all_profiles_fetched= true
           
        })
        .addCase(getAllConnections.fulfilled,(state,action)=>{
            
            state.isLoading= false,
            state.isError= false,
            state.connections= action.payload
        })
        .addCase(getAllConnections.pending,(state)=>{
            state.isLoading= true
        })
        .addCase(getAllConnections.rejected,(state,action)=>{
            state.isLoading= false,
            state.isError= true,
            state.message= action.payload?.message || "Something went wrong while fetching connections"
        })
        .addCase(getUserFromToken.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getUserFromToken.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.loggedIn = true;
         })
        .addCase(getUserFromToken.rejected, (state) => {
            state.isLoading = false;
            state.user = null;
            state.loggedIn = false;
        })
        .addCase(getConnectionRequests.pending, (state)=>{
            state.isLoading = true;
        })
        .addCase(getConnectionRequests.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.sentConnectionRequests = action.payload.connectionRequests;
        })
        .addCase(getConnectionRequests.rejected, (state)=>{
            state.isLoading = false;
            state.isError= true;
            state.sentConnectionRequests = null;
        })
        .addCase(getUpcomingRequests.pending, (state)=>{
            state.isLoading = true;
        })
        .addCase(getUpcomingRequests.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.receivedConnectionRequests = action.payload.connectionRequests;
        })
        .addCase(getUpcomingRequests.rejected, (state)=>{
            state.isLoading = false;
            state.isError= true;
            state.receivedConnectionRequests = null;
        })
        .addCase(deleteConnectionRequest.pending,(state)=>{
            state.isLoading=true;
        })
        .addCase(deleteConnectionRequest.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.sentConnectionRequests =
        state.sentConnectionRequests.filter(
          req => req._id !== action.payload
        );
        })
        .addCase(deleteConnectionRequest.rejected, (state,action)=>{
            state.isLoading = false;
            state.isError= true;
            state.sentConnectionRequests = null;
        })



    }
});


export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer;





// User jo action perform karta hai (login, get posts, etc.),
// usko actions wali file (createAsyncThunk) handle karti hai.
// Ye thunk backend ke routes ko request bhejta hai (jo humne pehle banaye hote hain).
// Backend routes process karke response return karte hain.
// Us response ke base par hum thunkAPI.fulfillWithValue ya thunkAPI.rejectWithValue decide karte hain.

// Ye fulfilled ya rejected actions reducer mein handle hote hain,
// jahan hum state ko update karte hain based on action type (pending, fulfilled, rejected).
// Is tarah se hum asynchronous operations ko Redux ke through manage karte hain,
// jisse application ka state consistent aur predictable rehta hai.

// Ye pura flow asynchronous tasks ko manage karne ke liye hai,
// jisse humare UI ko pata hota hai ki kab loading ho rahi hai,
// kab data successfully aaya hai, aur kab error hua hai.

// Isse hum better user experience provide kar sakte hain
// by showing loading indicators, success messages, or error alerts
// based on the state changes managed by Redux.

// Reducers ka kaam application ke state ko update karna hota hai. 
// Jab actions (jaise pending, fulfilled, ya rejected) fire hote hain, 
// reducers decide karte hain ki loading, data, ya error state kaise change hogi. 
// Reducers backend se direct baat nahi karte, balki actions se aane wale result ke
//  base par UI ke liye final state ready karte hain.