import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// this clientServer is an axios instance configured to interact with the backend server.


export const getAllPosts = createAsyncThunk(
    "posts/getAllPosts",
    async(_, thunkAPI)=>{

// _ means “I know this argument exists, but I don’t need it.”
// That’s it.
// Why this function even has a first argument
// createAsyncThunk always passes two arguments to the async function:
// async (payload, thunkAPI) => { ... }
// payload → data you pass when dispatching
// thunkAPI → Redux helpers
// Example:
// dispatch(getAllPosts(someData));
// Here someData becomes the payload.
// But in your case…
// dispatch(getAllPosts());
// You are:
// NOT passing any data
// Only calling an API that needs no input


        try{

            const response = await clientServer.get('/posts/get_posts');
            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const createPost = createAsyncThunk(
    "posts/createPost",
    async(userData,thunkAPI)=>{
        const {file,body} = userData;
        try{
            const formData = new FormData();
            formData.append('token', localStorage.getItem('token'))
            formData.append('body', body)
            formData.append('post_media', file)

            const response = await clientServer.post("/posts/create_post", formData, {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            });

            if(response.status === 200){
                return thunkAPI.fulfillWithValue("Post Uploaded");
            }
            else{
                return thunkAPI.rejectWithValue("An Error Occured");
            }

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const deletePost = createAsyncThunk(
    "post/deletePost",
    async(post_id, thunkAPI)=>{
        try{
            const response = await clientServer.delete("/posts/delete_post",{
                data : {
                 token: localStorage.getItem('token'),
                 post_id: post_id.post_id
                }
            });

            return thunkAPI.fulfillWithValue(response.data);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const toggleLikePost = createAsyncThunk(
  "posts/toggleLikePost",
  async ({ postId }, thunkAPI) => {
    try {
      const response = await clientServer.post("/posts/toggle_like", {
        token: localStorage.getItem("token"),
        postId
      });

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);


export const getCommentsByPost = createAsyncThunk(
    "post/getCommentsByPost",
    async(postData, thunkAPI)=>{
        try{
            const response = await clientServer.get("/posts/get_comments_by_post",{
                params: { post_id: postData.post_id }
            });
            return thunkAPI.fulfillWithValue({
                comments: response.data.comments,
                postId: postData.post_id});
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }   
    }
);

export const postComment = createAsyncThunk(
    "post/postComment",
    async(commentData, thunkAPI)=>{     
        try{
            const response = await clientServer.post("/posts/comment",{
                token: localStorage.getItem('token'),
                post_id: commentData.post_id,
                commentBody: commentData.commentText
            });
            return thunkAPI.fulfillWithValue(response.data);
        }

        catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);



export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ comment_id }, thunkAPI) => {
    try {
      const response = await clientServer.delete(
        "/posts/delete_comment",
        {
          data: {
            token: localStorage.getItem("token"),
            comment_id
          }
        }
      );

      return thunkAPI.fulfillWithValue(response.data); // return id for reducer
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);
