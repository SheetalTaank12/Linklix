import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { createPost, deletePost, getAllPosts,toggleLikePost, getCommentsByPost , postComment,deleteComment} from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPostId } from "@/config/redux/reducer/postReducer";
import styles from './index.module.css';
import { BASE_URL } from "@/config";

export default function Dashboard(){

    const router = useRouter();

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth)
    const postState = useSelector((state)=> state.posts)

  useEffect(() => {
  if (authState.isTokenThere) {
    dispatch(getAllPosts());
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }
}, [authState.isTokenThere]);


//❝Profiles are not fetched yet — go fetch them❞
// If all_profiles_fetched is false, fetch all user profiles
// This ensures we have the latest user data for displaying alongside posts
// This runs only once when the component mounts or when all_profiles_fetched changes
//  that way, we avoid unnecessary fetches and keep the app efficient

//“As we login we only get our user, so to show others we must fetch all users separately”
useEffect(() => {
  if (!authState.all_profiles_fetched) {
    dispatch(getAllUsers());
  }
}, [authState.all_profiles_fetched]);


    const [postContent, setPostContent] = useState("");
    const [fileContent, setFileContent]= useState();
    const [commentText, setCommentText] = useState("");

    const handleUpload = async()=>{
        await dispatch(createPost({file: fileContent, body: postContent}));
        setPostContent("");
        setFileContent(null);
        dispatch(getAllPosts());
    }
    

    const handleDelete = async(post_id)=>{
        await dispatch(deletePost({post_id: post_id}));
        dispatch(getAllPosts());
    }
   
const handleLike = async (postId) => {
  await dispatch(toggleLikePost({ postId }));
  dispatch(getAllPosts());
};



    const handleComments = (post_id)=>{
        dispatch(getCommentsByPost({post_id: post_id}));
    }

    const handleDeleteComment = async (comment_id,post_id) => {
  await dispatch(deleteComment({ comment_id }));
  await dispatch(getCommentsByPost({post_id: post_id}));
};


    const handleShareOnTwitter = (post) => {
    const text = encodeURIComponent(post?.body);
     const url = encodeURIComponent(`${BASE_URL}/post/${post?._id}`);

    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, "_blank");
     };


    const addComment = async(post_id, commentText)=>{
        // Dispatch action to add comment
        await dispatch(postComment({post_id, commentText}));
        // Clear comment input
        setCommentText("");
        // Refresh comments
        dispatch(getCommentsByPost({post_id}));
    }



    if(authState.profileFetched){
    return (
        <UserLayout>
            <DashboardLayout>

                <div className={styles.wrapper}>
                 <div className={styles.line}></div> 
                <div className={styles.scrollComponent}>
                    <div className={styles.createPostContainer}>
                        
                        <img className={styles.userProfile}  src={authState?.user?.userId?.profilePicture || "/default.jpg"} alt="text"/>
                        
                        <textarea onChange={(e)=>setPostContent(e.target.value)} value={postContent} placeholder={"What's in your mind?"} className={styles.textareaOfContent} name="" id=""></textarea>

                        <div className={styles.uploadWrapper}>
                        <label htmlFor="fileUpload">
                        <div className={styles.Fab}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                       </svg>

                        </div>
                        </label> 
                        {fileContent && (
                       <p className={styles.fileName}>
                         {fileContent?.name}
                        </p>
                        )}
                       

                       <input onChange={(e)=>setFileContent(e.target.files[0])} type="file" hidden id="fileUpload"/> 
                       {postContent?.length>0 &&
                       <div onClick={handleUpload} className={styles.uploadBtn}>Post</div>}

                       

                        </div>
                    </div>
                    
                </div>

                <div className={styles.postContainer}>
                    {postState?.posts?.map((post)=>{
                        return(

                            // console.log("POST USER ID:", post?.userId?._id),
// console.log("LOGGED USER ID:", authState?.user?.userId?._id),

                            <div key={post?._id} className={styles.singleCard}>

                                <div className={styles.singleCard_profileContainer}>
                                    
                                  
                                     <div className={styles.topDiv}>
                                      <div onClick={() => router.push(`/view_profile/${post?.userId?.username}`)} 
                                       className={styles.topDiv_left}>
                                        <img className={styles.userProfile} src={post?.userId?.profilePicture} alt="" />
                                        <div>
                                            <p style={{fontWeight:"bold"}}>{post?.userId?.name}</p>
                                            <p style={{color:"grey"}}>@{post?.userId?.username}</p>

                                        </div>
                                        </div> 
                                      <div className={styles.topDiv_right}>
                                         { (post?.userId?._id.toString() === authState?.user?.userId?._id.toString()) &&
                               ( <div onClick={() => handleDelete(post?._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                   </div>
                               )
                                }
                                        </div>    
                                    
                                    
                                    </div>
                                <div className={styles.middleDiv}>
                                 <p style={{paddingTop:"0.3rem"}}>{post?.body}</p>
                                    <div className={styles.singleCard_image}>
                                        <img src={post?.media}/>

                                    </div>

                                </div>
                                    
                                   
                                    <div className={styles.optionsContainer}>

                                       
                                        <div onClick={() => handleLike(post?._id)}
                                        className={styles.singleOption_optionsContainer}>
                                            {post?.likes?.includes(authState?.user?.userId?._id)?
                                                                               
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7c00e8" className="size-6">
  <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
</svg>
                                           
:
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
</svg>
 }
 
 

                                          {post?.likes?.length}
                                        </div>
                                      
                                        <div onClick={()=> handleComments(post?._id)}
                                        className={styles.singleOption_optionsContainer}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
</svg>
                                        {post?.comments}
                                        </div>

                                       
                                        <div onClick={() => handleShareOnTwitter(post)}
                                        className={styles.singleOption_optionsContainer}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
</svg>
                                        
                                        </div>

                                    

                                        </div>
                                   
                                </div>

                            </div>
                        )
                    })}
                </div>

                </div>


                {
                    postState?.postId !== "" &&
                    <div onClick={()=>{
                        dispatch(resetPostId());
                    }}
                    className={styles.commentsContainer}>
                    <div onClick={(e)=>{
                        e.stopPropagation()
                    }}
                    className={styles.commentsSection}>

                        {postState?.comments?.length===0 &&
                        <h2 className={styles.commentsHeading}>No Comments Yet</h2>
                        }



                        {postState?.comments?.length>0 && 
                        <div className={styles.allComments}>
                         <h2 id="top"  style={{scrollBehavior:"smooth"}} className={styles.commentsHeading}>Comments</h2>
                        {postState?.comments?.map((comment)=>{
                            return(
                                <div key={comment?._id} className={styles.singleComment}>
                                    <div className={styles.singleComment_profileContainer}>
                                     <img className={styles.userProfileInComment} src={comment?.userId?.profilePicture} alt="" />
                                     <div style={{display:"flex",alignItems:"center", justifyContent:"space-between",width:"100%"}}>
                                        <div>
                                    <p style={{fontWeight:"bold"}}>{comment?.userId?.name} </p>
                                    <p style={{color:"grey"}}>@{comment?.userId?.username}</p>
                                    </div>


                                    

                                   {comment?.userId?._id?.toString() === 
                                     authState?.user?.userId?._id?.toString() && (
                                    <div className={styles.deleteCommentIcon} onClick={()=>handleDeleteComment(comment?._id,comment?.postId)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                        </div>
                                       )}  
                                    </div>  
                                    </div>
                                    <p className={styles.commentBody}>{comment?.body}</p>

                                </div>
                            )
                        })}
                        </div>}
                       
                        <div className={styles.commentInputContainer}>
                            <input className={styles.commentInput} type="text" placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            />
                            <div 
                            onClick={() => addComment(postState.postId, commentText)} 
                            className={styles.commentBtn}><a  href="#top">Comment</a></div>
                        </div>
                       
                    </div>
                </div>
                }
            </DashboardLayout>
        </UserLayout>
    )
   }
   else{

     return (
        <UserLayout>
            <DashboardLayout>

                <h2>Loading...</h2>
            </DashboardLayout>
        </UserLayout>
    )

   }
}