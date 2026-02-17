import React, { useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllConnections, getAllUsers,removeConnection,getUpcomingRequests } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { BASE_URL } from "@/config";
import { useState } from "react";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state)=>
          state.auth)
  const { connections, isLoading, isError } = authState;
  
  

  useEffect(() => {
  if(authState.isTokenThere){
  dispatch(
    getAllConnections({
      token: localStorage.getItem("token") 
    })
  
  );
}
}, [authState.isTokenThere]);


useEffect(() => {
  if (!authState.all_profiles_fetched) {
    dispatch(getAllUsers());
  }
}, [authState.all_profiles_fetched]);

 
// useEffect(() => {
//   console.log("AUTH STATE:", authState);
// }, [authState]);

//   useEffect(() => {
//   console.log("UPDATED AUTH STATE:", authState);
// }, [authState]);
 
const getConnectedUser = (connection) => {
  const currentId = authState?.user?.userId?._id;

  if (!currentId || !connection?.userId || !connection?.connectionId) {
    return null;
  }

  const userId = String(connection.userId._id);
  const connectionId = String(connection.connectionId._id);
  const me = String(currentId);

  return userId === me
    ? connection.connectionId
    : connection.userId;
};



const handleRemoveConnection = async (e,requestId) => {
  e.stopPropagation();
  await dispatch(
  removeConnection({
      token: localStorage.getItem("token"),
      requestId: requestId,
    })
  );

  dispatch(getUpcomingRequests({ token: localStorage.getItem("token") }));
  dispatch(
    getAllConnections({
      token: localStorage.getItem("token") 
    }));
};



  
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div style={{display:"flex",gap:"0.7rem",alignItems:"center", paddingLeft:"1rem",paddingTop:"1rem"}}>
          <h1 className={styles.connectionHeader}>My Connections ({connections?.length}) </h1>
          
            </div>
          {/* Loading */}
          {isLoading && <p>Loading connections...</p>}

          {/* Error */}
          {isError && <p className={styles.error}>{isError}</p>}

          {/* Empty state */}
          {!isLoading && connections?.length === 0 && (
            <p>No connections found.</p>
          )}

          

          {/* Connections list */}
          <div className={styles.list}>
            
{!authState.isLoading &&
  connections?.length > 0 &&
  connections.map((connection) => {
    const connectedUser = getConnectedUser(connection);

    // 🔴 THIS WAS BLOCKING YOUR UI
    if (!connectedUser) return null;

    return (
      <div key={connection._id} className={styles.card}>
        <div
          className={styles.connectionCard}
          onClick={() => router.push(`/view_profile/${connectedUser.username}`)}
        >
          <div>
            <img
              src={`${BASE_URL}/${connectedUser.profilePicture}`}
              alt="Profile Picture"
              className={styles.profilePic}
            />
          </div>

          <div className={styles.connectionInfo}>
            <div className={styles.userInfo}>
              <p className={styles.name}>{connectedUser.name}</p>
              <p style={{ color: "grey" }}>
                @{connectedUser.username}
              </p>
              
            </div>

           
              <button
                className={styles.removeButton}
                onClick={(e) => {
                 handleRemoveConnection(e, connection._id)
                  // remove connection
                }}
              ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

                Remove
              </button>
          
          </div>
        </div>
      </div>
    );
  })}


          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
