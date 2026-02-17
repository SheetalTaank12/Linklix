import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import {  getAllUsers ,getConnectionRequests,getUpcomingRequests, deleteConnectionRequest, acceptConnectionRequest,rejectConnectionRequest, getAllConnections} from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/navigation";

export default function requestsPage() {
 const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state)=>
            state.auth)
      const { sentConnectionRequests,receivedConnectionRequests, isLoading, isError } = authState;
    
     const [sentRequests, setSentRequests] = useState([]);
     const [receivedRequests, setReceivedRequests] = useState([]);
  
      
        useEffect(() => {
        if(authState.isTokenThere){
        dispatch(
          getConnectionRequests({
            token: localStorage.getItem("token") 
          })  
        );
        
      }
      }, [authState.isTokenThere]);

       useEffect(() => {
        if(authState.isTokenThere){

        dispatch(
          getUpcomingRequests({
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

  
    const getSentRequests = () => {
       const allSentRequests = authState?.sentConnectionRequests;
       
      const filteredRequests = allSentRequests?.filter(
        (request) => request.status_accepted === null
      );
      setSentRequests(filteredRequests);
      // console.log(`sent requests: ${sentRequests?.userId?.name}`, filteredRequests);
    };
  
    useEffect(() => {

      getSentRequests();
    }, [authState.sentConnectionRequests]);

   
    useEffect(() => {
  if (!authState?.user?.userId?._id) return;

  const filteredRequests =
    authState.receivedConnectionRequests?.filter(
      (request) =>
        request.status_accepted === null
    );

  setReceivedRequests(filteredRequests);
}, [
  authState.receivedConnectionRequests,
  authState.user?.userId?._id
]);


const pendingReceivedRequests = receivedConnectionRequests?.filter(
  (req) => req.status_accepted === null
);


const pendingSentRequests = sentConnectionRequests?.filter(
  (req) => req.status_accepted === null
);


  const [sentClicked,setSentClicked]= useState(true);
  const [receivedClicked, setReceivedClicked]= useState(false);

  const handleSentClick =()=> {
      setSentClicked(true);
      setReceivedClicked(false);
  }

  
  const handleReceivedClick =()=> {
      setReceivedClicked(true);
      setSentClicked(false);
  }
  const handleDeleteRequest = (e, requestId) => {
  e.stopPropagation();
   dispatch(deleteConnectionRequest({
            token: localStorage.getItem("token") ,
            requestId: requestId
          }))
        
};



//accept & deny
const handleAccept = async (e,requestId) => {
   e.stopPropagation();
  await dispatch(
    acceptConnectionRequest({
      token: localStorage.getItem("token"),
      requestId: requestId,
    })
  );

  dispatch(getUpcomingRequests({ token: localStorage.getItem("token") }));
  dispatch(getAllConnections({ token: localStorage.getItem("token") }));
};

const handleDeny = async (e,requestId) => {
  e.stopPropagation();
  await dispatch(
    rejectConnectionRequest({
      token: localStorage.getItem("token"),
      requestId: requestId,
    })
  );
 
  dispatch(getUpcomingRequests({ token: localStorage.getItem("token") }));
};

  return (
     <UserLayout>
      <DashboardLayout>
    <div className={styles.requestContainer}>
      <div className={styles.top}>
      <div onClick={handleSentClick}  style={{ borderBottomColor: sentClicked ? "#7c00e8" : "transparent", backgroundColor: sentClicked ? "#eee" : "transparent",color: sentClicked ? "#000" : "#666" }}>
      <h3>Sent</h3>
      </div>
      <div onClick={handleReceivedClick}  style={{ borderBottomColor: receivedClicked ? "#7c00e8" : "transparent", backgroundColor: receivedClicked ? "#eee" : "transparent",color: receivedClicked ? "#000" : "#666" }}>
      <h3 >
        Received</h3>
      </div>
      </div>
      <div className={styles.viewRequests}>
        {sentClicked && 
        <div className={styles.sent}>
          
           {/* Loading */}
          {isLoading && <p style={{textAlign:"center", marginTop:"2rem", paddingBottom:"100vh"}}>Loading requests...</p>}

          {/* Error */}
          {isError && <p style={{textAlign:"center", marginTop:"2rem",paddingBottom:"100vh"}} className={styles.error}>{isError}</p>}

          {/* Empty state */}
          {!isLoading && pendingSentRequests?.length === 0 && (
            <p style={{textAlign:"center", marginTop:"2rem",paddingBottom:"100vh"}}>No pending requests.</p>
          )}

          {}

           {/* Requests list */}
          <div className={styles.list}>
            
{!authState.isLoading &&
  sentRequests?.length > 0 &&
  sentRequests.map((request) => {
   
    return (
      <div onClick={() => router.push(`/view_profile/${request?.connectionId?.username}`)} key={request._id} className={styles.card}>
        <div
          className={styles.connectionCard}
          
        >
          <div>
            <img
              src={`${BASE_URL}/${request?.connectionId?.profilePicture}`}
              alt="Profile Picture"
              className={styles.profilePic}
            />
          </div>

          <div className={styles.connectionInfo}>
            <div className={styles.userInfo}>
              <p className={styles.name}>{request?.connectionId?.name}</p>
              <p style={{ color: "grey" }}>
                @{request?.connectionId?.username}
              </p>
              
            </div>

             <div className={styles.removeBtn}
      onClick={(e) =>
        handleDeleteRequest(e, request._id)
      }
      style={{ cursor: "pointer", color: "red" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
    </div>
 
          </div>
         
        </div>
      </div>
    );
  })}
  </div>
        </div>}

        {receivedClicked && 
        <div className={styles.received}>
          
            {/* Loading */}
          {isLoading && <p style={{textAlign:"center", marginTop:"2rem", paddingBottom:"100vh"}}>Loading requests...</p>}

          {/* Error */}
          {isError && <p className={styles.error} style={{textAlign:"center", marginTop:"2rem",paddingBottom:"100vh"}}>{isError}</p>}

          {/* Empty state */}
         

           {!isLoading && pendingReceivedRequests?.length === 0 && (
            <p style={{textAlign:"center", marginTop:"2rem",paddingBottom:"100vh"}}>No pending requests.</p>
          )}



          {/* Requests list */}
          <div className={styles.list}>
            
{!authState.isLoading &&
  receivedRequests?.length > 0 &&
  receivedRequests.map((request) => {
   
    return (
      <div onClick={() => router.push(`/view_profile/${request?.userId?.username}`)} key={request._id} className={styles.card}>
        <div
          className={styles.connectionCard}
          
        >
          <div>
            <img
              src={`${BASE_URL}/${request?.userId?.profilePicture}`}
              alt="Profile Picture"
              className={styles.profilePic}
            />
          </div>

          <div className={styles.connectionInfo}>
            <div className={styles.userInfo}>
              <p className={styles.name}>{request?.userId?.name}</p>
              <p style={{ color: "grey" }}>
                @{request?.userId?.username}
              </p>
              
            </div>
            <div style={{ display: "flex", gap: "0.3rem",alignItems:"center" }}>
             <div
      className={styles.acceptButton}
      onClick={(e)=>handleAccept(e,request._id)}
    >
      
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>

    </div>

    <div
      className={styles.denyButton}
      onClick={(e)=>handleDeny(e,request._id)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

    </div>
    </div>
          </div>
         
        </div>
      </div>
    );
  })}
  </div>


        </div>}


      </div>

    </div>

    </DashboardLayout>
    </UserLayout>
  )
}
