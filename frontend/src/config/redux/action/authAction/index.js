import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// createSlice is used in reducers because it defines the state and 
// how it changes synchronously. Reducers must be pure and cannot perform
//  async tasks. createAsyncThunk is used in actions to handle asynchronous
//  logic like API calls. It dispatches pending, fulfilled, and rejected 
// actions automatically, which are then handled inside createSlice using 
// extraReducers to update the state.






//This async thunk sends login data to the server, saves the token if login succeeds, 
// and tells Redux whether the request succeeded or failed so the UI can react.
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
// why we again check login ?
// Backend login authenticates the user and returns a response, 
// while frontend login code handles API calls, stores the token, manages 
// loading/error states, and updates the UI based on that response.




export const registerUser = createAsyncThunk(
    "user/register",
    async (user,thunkAPI)=>{
        try{
                const response = await clientServer.post(`/user/register`,{
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name
            });

             return thunkAPI.fulfillWithValue(response.data);
        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
        
    }
)




export const getAboutUser = createAsyncThunk(
    "user/getUserAndProfile",
    async(user , thunkAPI) =>{
        try{

            const response = await clientServer.get("/user/get_user_and_profile",{
                params: {token: user.token}
            })

            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const getAllUsers = createAsyncThunk(
    "user/getAllUserProfile",
    async(user, thunkAPI) =>{
        try{
            const response = await clientServer.get('/user/get_all_users')
            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


//which i have sent to people
export const getConnectionRequests = createAsyncThunk(
    "user/getMyConnectionRequests",
    async(user, thunkAPI) =>{
        try{
            const response = await clientServer.get('/user/get_connection_requests',{
                params: {token: user.token}
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

//which people have sent to me
export const getUpcomingRequests = createAsyncThunk(
    "user/getUpcomingRequests",
    async(user, thunkAPI) =>{
        try{
            const response = await clientServer.get('/user/get_upcoming_requests',{
                params: {token: user.token}
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const getAllConnections = createAsyncThunk(
    "user/getAllConnections",
    async(user, thunkAPI) =>{
        try{
            const response = await clientServer.get('/user/get_all_connections',{
                params: {token: user.token}
            })
            
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
     "user/sendConnectionRequest",
      async(user, thunkAPI) =>{
        try{
            const response = await clientServer.post('/user/send_connection_request',{
                token: user.token,
                connectionId: user.user_id
            })
            
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }

)

export const deleteConnectionRequest = createAsyncThunk(
  "user/deleteConnectionRequest",
  async (user, thunkAPI) => {
    try{
        
    const response = await clientServer.delete(`/user/delete_connection_request`,{
              data: {
    token: user.token,
    requestId: user.requestId
  }
                    });
    return thunkAPI.fulfillWithValue(user.requestId);

}catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
  }
);




export const acceptConnectionRequest = createAsyncThunk(
    "user/acceptConnectionRequest",
    async(user,thunkAPI)=>{
         try{
            
            const response = await clientServer.post('/user/accept_connection_request',{
                
    token: user.token,
    requestId: user.requestId
  
                 
                    })
            
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const rejectConnectionRequest = createAsyncThunk(
    "user/rejectConnectionRequest",
    async(user,thunkAPI)=>{
         try{
            
            const response = await clientServer.delete('/user/reject_connection_request',{
       data:{         
    token: user.token,
    requestId: user.requestId
       }
                 
                    })
            
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


export const removeConnection = createAsyncThunk(
    "user/removeConnection",
    async(user,thunkAPI)=>{
         try{
            
            const response = await clientServer.delete('/user/remove_connection',{
       data:{         
    token: user.token,
    requestId: user.requestId
       }
                 
                    })
            
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)





export const getUserFromToken = createAsyncThunk(
  "auth/getUserFromToken",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const res = await clientServer.get("/user/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);



export const uploadProfilePicture= createAsyncThunk(
    "user/uploadProfilePicture",
    async(userData,thunkAPI)=>{
        const {file} = userData;
        try{
            const formData = new FormData();
            formData.append('token', localStorage.getItem('token'))
            
            formData.append('profile_picture', file)

            const response = await clientServer.post("/user/update_profile_picture", formData, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            });

            if(response.status === 200){
                return thunkAPI.fulfillWithValue("Profile Picture Updated");
            }
            else{
                return thunkAPI.rejectWithValue("An Error Occured");
            }

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)




export const deleteWorkInfo = createAsyncThunk(
  "user/deleteWorkInfo",
  async ({ work_id }, thunkAPI) => {
    try {
      const response = await clientServer.delete(
        "/user/delete_work",
        {
          data: {
            token: localStorage.getItem("token"),
            work_id
          }
        }
      );

      return thunkAPI.fulfillWithValue(response.data); 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);


export const deleteEducationInfo = createAsyncThunk(
  "user/deleteEducationInfo",
  async ({ edu_id }, thunkAPI) => {
    try {
      const response = await clientServer.delete(
        "/user/delete_edu",
        {
          data: {
            token: localStorage.getItem("token"),
            edu_id
          }
        }
      );

      return thunkAPI.fulfillWithValue(response.data); 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);