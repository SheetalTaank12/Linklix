import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI)=>{
        try{
            const response = await clientServer.post(`/user/login`,{
                email: user.email,
                password: user.password
            });
        if(response.data.token){
            localStorage.setItem("token",response.data.token);
        } else{
            return thunkAPI.rejectWithValue({
                message: "token not provided"
            })
        } 

        return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)



export const registerUser = createAsyncThunk(
    "user/register",
    async (user,thunkAPI)=>{
        try{
                const request = await clientServer.post(`/user/register`,{
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name
            });

             return response.data;
        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
        
    }
)




export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user , thunkAPI) =>{
        try{

            const response = await clientServer.get("/get_user_and_profile",{
                params: {token: user.token}
            })

            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async(user, thunkAPI) =>{
        try{
            const response = await clientServer.get('/get_all_users')
            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)