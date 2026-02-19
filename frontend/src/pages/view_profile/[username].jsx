import React, { useEffect } from 'react'

import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction'
import { useDispatch } from 'react-redux';
import { getConnectionRequests, sendConnectionRequest, getAllConnections, getAllUsers,getUpcomingRequests,acceptConnectionRequest,rejectConnectionRequest } from '@/config/redux/action/authAction';
import { useState } from 'react';


export default function ViewProfilePage(userProfile) {
    

  const router = useRouter();
  const dispatch = useDispatch();

  const postReducer = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);

  const { sentConnectionRequests,receivedConnectionRequests } = authState;

  const [userPosts, setUserPosts] = useState([]);

  const profileUserId = String(userProfile?.userProfile?.userId?._id);

  /* ------------------ FETCH DATA ------------------ */

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllPosts());
      await dispatch(
        getConnectionRequests({ token: localStorage.getItem("token") })
      );
      await dispatch(
        getUpcomingRequests({ token: localStorage.getItem("token") })
      );
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (!authState?.user) return;

    dispatch(
      getAllConnections({
        token: localStorage.getItem("token"),
      })
    );
  }, [authState?.user, dispatch]);

  /* ------------------ POSTS ------------------ */

  useEffect(() => {
    if (!postReducer.posts) return;

    const filteredPosts = postReducer.posts.filter(
      (post) => String(post?.userId?._id) === profileUserId
    );

    setUserPosts(filteredPosts);
  }, [postReducer.posts, profileUserId]);

  /* ------------------ CONNECTION STATE (DERIVED) ------------------ */


  const incomingRequest = authState.receivedConnectionRequests?.find(
  (req) => String(req.userId?._id) === profileUserId && req.status_accepted === null
);

  const outgoingRequest = sentConnectionRequests?.find(
    (req) => String(req.connectionId?._id) === profileUserId
  );

  

  const existingConnection = authState.connections?.find(
    (conn) =>
      String(conn.userId?._id) === profileUserId ||
      String(conn.connectionId?._id) === profileUserId
  );

  let relationshipStatus = "none";

if (incomingRequest) {
  relationshipStatus = "incoming";
} else if (existingConnection?.status_accepted === true) {
  relationshipStatus = "connected";
} else if (outgoingRequest?.status_accepted === null) {
  relationshipStatus = "pending";
}


  /* ------------------ HANDLERS ------------------ */

  const handleConnect = async () => {
    await dispatch(
      sendConnectionRequest({
        token: localStorage.getItem("token"),
        user_id: profileUserId,
      })
    );

    dispatch(
      getConnectionRequests({
        token: localStorage.getItem("token"),
      })
    );
  };




  const handleAccept = async () => {
  await dispatch(
    acceptConnectionRequest({
      token: localStorage.getItem("token"),
      requestId: incomingRequest?._id,
    })
  );

  dispatch(getUpcomingRequests({ token: localStorage.getItem("token") }));
  dispatch(getAllConnections({ token: localStorage.getItem("token") }));
};
// console.log("i:  ",incomingRequest)

const handleDeny = async () => {
  await dispatch(
    rejectConnectionRequest({
      token: localStorage.getItem("token"),
      requestId: incomingRequest?._id,
    })
  );

  dispatch(getUpcomingRequests({ token: localStorage.getItem("token") }));
};

   
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.profileContainer}>
          <div className={styles.backDropContainer}>
         
          <img src={userProfile?.userProfile?.userId?.profilePicture || "/default.jpg"} alt="Backdrop Image" className={styles.backDropImage}/>
          </div>
          <div className={styles.profileDetailsContainer}>
           
            <div className={styles.userDetailSection}>

                <div className={styles.userDetailSection_left}>
                <h2>{userProfile?.userProfile?.userId?.name}</h2>
                <p style={{color:"grey"}}>@{userProfile?.userProfile?.userId?.username}</p>
                
                 <p style={{marginTop: "0.4rem"}}>{userProfile?.userProfile?.bio}</p>
               
                
                </div>
                <div className={styles.userStats}>
                  

                   <p>{userProfile?.userProfile?.followers} Followers</p>
                   <p>{userProfile?.userProfile?.connections} Connections</p>
                   
                   <p>{userPosts?.length} Posts</p>
                   <div>
                  {relationshipStatus === "incoming" ? (
  <div style={{ display: "flex", gap: "0.3rem" }}>
    <button
      className={styles.acceptButton}
      onClick={handleAccept}
    >
      Accept
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>

    </button>

    <button
      className={styles.denyButton}
      onClick={handleDeny}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

    </button>
  </div>
) : (
  <button
    onClick={relationshipStatus === "none" ? handleConnect : undefined}
    disabled={relationshipStatus !== "none"}
    className={
      relationshipStatus === "connected"
        ? styles.connectedButton
        : relationshipStatus === "pending"
        ? styles.pendingButton
        : styles.connectButton
    }
  >
    {relationshipStatus === "connected"
      ? "Connected"
      : relationshipStatus === "pending"
      ? "Pending"
      : "Connect"}
  </button>
)}

                <div  onClick={async()=>{
                  const response = await clientServer.get(`/user/download_resume?id=${userProfile?.userProfile?.userId?._id}`);
                  window.open(`${BASE_URL}/${response?.data?.message}`,"_blank")
                }} 
                style={{cursor:"pointer"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </div>
                </div>     
                </div>

            </div>

            <div className={styles.profileStats}>
              <h3>Work History</h3>
              
              <div className={styles.workHistoryContainer}>
               {userProfile?.userProfile?.pastWork?.length === 0 && (
                <p className={styles.para}>No work history added yet</p>
              )}
              {
              userProfile?.userProfile?.pastWork?.map((work,index)=>{
                return(
                
                  <div key={index} className={styles.workHistoryCard}>
                   
                  <p style={{fontWeight:"bold"}}>
                    {work?.company} - {work?.position}
                  </p>
                  <p>{work?.years}</p>

                  </div>
                )

              })
              }

              </div>
            </div>


             <div className={styles.profileStats}>
              <h3>Education</h3>
              
              <div className={styles.workHistoryContainer}>
               {userProfile?.userProfile?.education?.length === 0 && (
                <p className={styles.para}>No education history added yet</p>
              )}
              {
              userProfile?.userProfile?.education?.map((field,index)=>{
                return(
                
                  <div key={index} className={styles.workHistoryCard}>
                   
                  <p style={{fontWeight:"bold"}}>
                    {field?.school} - {field?.degree}
                  </p>
                  <p>{field?.fieldOfStudy}</p>

                  </div>
                )

              })
              }

              </div>
            </div>

            <div className={styles.profileStats}>
              <h3>Activity</h3>
               {userPosts?.length === 0 && (
                <p className={styles.para}>No posts created yet</p>
              )}
             
              {userPosts?.map((post)=>{
                return (
                  <div key={post?._id}  className={styles.postCard}>

                    <div className={styles.card}>
                <div className={styles.profileContainer}>
                {post?.media !== "" ? <img src={post?.media} alt="Post Media" className={styles.postMedia}/>
                 : <div> <img src={``} alt="Default Post Media" className={styles.postMedia}/></div>}
                  </div>
                  <p>{post?.body}</p>
                
                </div>
                </div>
                );
              })}
           </div>
           
     
    </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}


export async function getServerSideProps(context) {

  // console.log("from view profile page");
  
   
  const request = await clientServer.get(`/user/get_user_based_on_username`,{
    params: {
        username: context.query.username
    }
  });
  // console.log(context.query.username);
  const userData = request?.data;
  // console.log("User data fetched from server:", userData);
    return {
        props: {
            userProfile: userData,
            
        },
    };
}
