import React from 'react';
import { createPost, getAllPosts} from "@/config/redux/action/postAction";
import { getAboutUser } from "@/config/redux/action/authAction";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from './index.module.css';
import { BASE_URL } from "@/config";

export default function CreatePostPage() {

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



  
      const [postContent, setPostContent] = useState("");
      const [fileContent, setFileContent]= useState();
      const [commentText, setCommentText] = useState("");
  
      const handleUpload = async()=>{
          await dispatch(createPost({file: fileContent, body: postContent}));
          setPostContent("");
          setFileContent(null);
          router.push('/dashboard');
      }

      const handleCancel = async()=>{
          
          setPostContent("");
          setFileContent(null);
          router.push('/dashboard');
      }



  return (
    <UserLayout>
      <div className={styles.wrapper}>
               <div className={styles.createPostContainer}>
                        <div className={styles.top}>
                        <div className={styles.top_left}>
                          <img className={styles.userProfile}  src={authState?.user?.userId?.profilePicture || "/default.jpg"} alt="text"/> 
                          <h4>{authState?.user?.userId?.name}</h4>
                          </div>
                         <div className={styles.top_right}>
                          <div onClick={handleCancel} className={styles.cancel}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>   </div>
                          </div> 

                        </div>
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
                         {fileContent.name}
                        </p>
                        )}
                       

                       <input onChange={(e)=>setFileContent(e.target.files[0])} type="file" hidden id="fileUpload"/> 
                       {postContent.length>0 &&
                       <div onClick={handleUpload} className={styles.uploadBtn}>Post</div>}

                       

                        </div>
                    </div>
                    </div>
                    
    </UserLayout>
  )
}
