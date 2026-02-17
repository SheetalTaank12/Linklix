import React, { useEffect } from 'react'

import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction'
import { useDispatch } from 'react-redux';
import { getConnectionRequests,uploadProfilePicture, getAllConnections, getAllUsers, getAboutUser,deleteWorkInfo, deleteEducationInfo } from '@/config/redux/action/authAction';
import { useState } from 'react';


export default function ViewProfilePage() {
    
   const router = useRouter();

   const postReducer = useSelector((state)=> state.posts);
   const dispatch = useDispatch();

   const authState = useSelector((state)=> state.auth);
  

   
     useEffect(() => {
     if(authState.isTokenThere){
     dispatch(getAboutUser({
        token: localStorage.getItem("token") 
      }));
   }
   }, [authState.isTokenThere]);
   
    useEffect(() => {
    
    dispatch(
      getAllConnections({
        token: localStorage.getItem("token") 
      })
    );
    
  },[]);
   const { connectionRequests, isLoading, isError } = authState;
     
   const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
  if (!authState?.user?.userId || postReducer.posts.length === 0) return;

  const filteredPosts = postReducer.posts.filter(
    (post) => post?.userId?._id === authState.user.userId._id
  );

  setUserPosts(filteredPosts);
  
}, [postReducer.posts, authState.user]);


  useEffect(() => {
    if(authState.isTokenThere){
     dispatch(getAllPosts());
    
     dispatch(getConnectionRequests({token: localStorage.getItem("token")}));
    }
  }, [authState.isTokenThere]);
  

  // console.log(authState.isTokenThere)

   
 
 useEffect(() => {
   if (!authState.all_profiles_fetched) {
     dispatch(getAllUsers());
   }
 }, [authState.all_profiles_fetched]);
 

   
    // console.log("User Profile ID:", authState?.user?._id);
   

//   useEffect(() => {
//   console.log("posts updated correctly:", postReducer.posts);
// }, [postReducer.posts]);
//   useEffect(() => {
//     console.log("connections updated correctly:", authState.connections);
//   }, [authState.connections]);
const [profileImage, setProfileImage] = useState();


    const handleUploadProfilePicture = async() => {
  if (!profileImage) return;


   await dispatch(uploadProfilePicture({file: profileImage}));
          
          setProfileImage(null);
          dispatch(getAboutUser({
        token: localStorage.getItem("token") 
      }));
};

  
const [editProfile,setEditProfile]= useState(false);
const [editWork, setEditWork]= useState(false);
const [editEducation, setEditEducation]= useState(false);

const [userProfileData,setUserProfileData] = useState(null);



useEffect(() => {
  if (authState?.user) {
    setUserProfileData(authState.user);
  }
}, [authState?.user]);



//update name username email
const [errorMessage, setErrorMessage] = useState("");
const [loading, setLoading] = useState(false);






const handleUploadProfileData= async()=>{

  try{

    setLoading(true);
    setErrorMessage("");


  const request = await clientServer.post("/user/user_update",{
    token: localStorage.getItem("token"),
    name:userProfileData?.userId?.name,
    username:userProfileData?.userId?.username,
    email:userProfileData?.userId?.email
  });

  const response = await clientServer.post("/user/update_profile_data",{
    token: localStorage.getItem("token"),
    bio:userProfileData?.bio,
    currentPost:userProfileData?.currentPost,
    pastWork:userProfileData?.pastWork,
    education:userProfileData?.education
  });

   dispatch(getAboutUser({
        token: localStorage.getItem("token") 
      }));
  setEditProfile(false);
   } catch (err) {
    setErrorMessage(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
 
  
}

//update work
const [inputData,setInputData]= useState({ company:'', position:'', years:''})

const handleWorkInputChange = async(e)=>{
  const {name,value} = e.target;
  setInputData({...inputData,[name]:value});
}


const handleUploadWorkData= async(updatedData)=>{

  try{

    setLoading(true);
    setErrorMessage("");


  const response = await clientServer.post("/user/update_profile_data",{
    token: localStorage.getItem("token"),
    pastWork:updatedData?.pastWork,
    
  });

   dispatch(getAboutUser({
        token: localStorage.getItem("token") 
      }));

      setInputData({ company:'', position:'', years:''});

  setEditWork(false);
 
   } catch (err) {
    setErrorMessage(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
 
  
}


//update education
const [eduData,setEduData]= useState({ school:'', degree:'', fieldOfStudy:''})

const handleEduInputChange = async(e)=>{
  const {name,value} = e.target;
  setEduData({...eduData,[name]:value});
}


const handleUploadEduData= async(updatedData)=>{

  try{

    setLoading(true);
    setErrorMessage("");


  const response = await clientServer.post("/user/update_profile_data",{
    token: localStorage.getItem("token"),
    education:updatedData?.education,
    
  });

   dispatch(getAboutUser({
        token: localStorage.getItem("token") 
      }));

      setEduData({ company:'', position:'', years:''});

  setEditEducation(false);
   } catch (err) {
    setErrorMessage(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
 
}

  const handleDeleteWork = async (work_id) => {
  await dispatch(deleteWorkInfo({ work_id }));
  await dispatch(getAboutUser({
        token: localStorage.getItem("token") 
      }));
};


  const handleDeleteEducation = async (edu_id) => {
  await dispatch(deleteEducationInfo({ edu_id }));
  await dispatch(getAboutUser({
        token: localStorage.getItem("token") 
      }));
};




  return (
    <UserLayout>
      <DashboardLayout>
        
        { <div className={styles.profileContainer}>
          <div className={styles.backDropContainer}>
         
          <img src={`${BASE_URL}/${userProfileData?.userId?.profilePicture}`} alt="Backdrop Image" className={styles.backDropImage}/>
          <div
           className={styles.overlay}>
            <label htmlFor="profilePicUpload">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">    
       <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg></label>


       <input
    type="file"
    id="profilePicUpload"
    hidden
    accept="image/*"
    onChange={(e) => setProfileImage(e.target.files[0])}
  />
  
 
  
     </div>
      {profileImage && (
  <button onClick={handleUploadProfilePicture} className={styles.uploadBtn}>
    Save
  </button>
  
)}
     {profileImage && (
  <img
    src={URL.createObjectURL(profileImage)}
    alt="preview"
    className={styles.preview}
  />
)}
          </div>
          <div className={styles.profileDetailsContainer}>
           
            <div className={styles.userDetailSection}>

                <div className={styles.userDetailSection_left}>
                  
                <h2>{userProfileData?.userId?.name}</h2>
                <p style={{color:"grey"}}>@{userProfileData?.userId?.username}</p>
                <p style={{color:"grey"}}>{userProfileData?.userId?.email}</p>
                 <p style={{marginTop: "0.4rem"}}>{userProfileData?.bio}</p>
                
                
                </div>
                <div className={styles.userStats}>
                  

                   <p>{userProfileData?.followers} Followers</p>
                   <p>{userProfileData?.connections} Connections</p>
                   
                   <p>{userPosts.length} Posts</p>
                   <div>
                   
                  
                  <button onClick={()=>{setEditProfile(true)}}
                   className={styles.connectedButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>
 Edit</button>
                
                 
                
                <div  onClick={async()=>{
                  const response = await clientServer.get(`/user/download_resume?id=${userProfileData?.userId?._id}`);
                  window.open(`${BASE_URL}/${response.data.message}`,"_blank")
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
              <button onClick={()=>{setEditWork(true)}}
              className={styles.addBtn}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                       </svg>Add</button>
             
              <div className={styles.workHistoryContainer}>
               {userProfileData?.pastWork?.length === 0 && (
                <p>No work history added yet</p>
              )}
              {
              userProfileData?.pastWork?.map((work,index)=>{
                return(
                
                  <div key={index} className={styles.workHistoryCard}>
                   {userProfileData?.userId?._id?.toString() === 
                                     authState?.user?.userId?._id?.toString() && (
                                    <div className={styles.deleteIcon} onClick={()=>handleDeleteWork(work?._id)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                        </div>
                                       )}  
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
              <button onClick={()=>{setEditEducation(true)}}
              className={styles.addBtn}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                       </svg>Add</button>
              
              <div className={styles.workHistoryContainer}>
               {userProfileData?.education?.length === 0 && (
                <p>No education history added yet</p>
              )}
              {
              userProfileData?.education?.map((field,index)=>{
                return(
                
                  <div key={index} className={styles.workHistoryCard}>
                   {userProfileData?.userId?._id?.toString() === 
                                     authState?.user?.userId?._id?.toString() && (
                                    <div className={styles.deleteIcon} onClick={()=>handleDeleteEducation(field?._id)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                        </div>
                                       )}  
                  <p style={{fontWeight:"bold"}}>
                    {field.school} - {field.degree}
                  </p>
                  <p>{field.fieldOfStudy}</p>

                  </div>
                )

              })
              }

              </div>
            </div>

            {/* Edit profile */}
             {
                    (editProfile == true) &&
                    <div onClick={()=>{
                        setEditProfile(false)
                    }}
                    className={styles.editProfileContainer}>
                    <div onClick={(e)=>{
                        e.stopPropagation()
                    }}
                    className={styles.editProfileSection}>
                    <h3>Edit Profile</h3>
                    <div>
                    <label htmlFor='name'>Name: </label>
                      <input className={styles.editName} type='text' value={userProfileData?.userId?.name} 
                      onChange={(e)=>setUserProfileData({...userProfileData, userId:{...userProfileData.userId, name:e.target.value}})} id='name'/>
                      </div>
                      <div>
                      <label htmlFor='username'>Username: </label>
                      <input id='username'
                  className={styles.editName} type="text" value={userProfileData?.userId?.username}
               onChange={(e) =>
             setUserProfileData({...userProfileData, userId: {
               ...userProfileData.userId, username: e.target.value,
              }})}/>

                      </div>
                      <div>
                      <label htmlFor='email'>Email: </label>
                      <input className={styles.editName} type='text' value={userProfileData?.userId?.email} 
                      onChange={(e) =>
             setUserProfileData({...userProfileData, userId: {
               ...userProfileData.userId, email: e.target.value,
              }})} id='email'/>
                      </div>
                      {errorMessage && <p style={{ color:"red", marginTop:"0"}}>{errorMessage}</p>}

                      
                      <div>
                      <label htmlFor='bio'>Bio: </label>
                      <input className={styles.editName} type='text' value={userProfileData?.bio} 
                      onChange={(e) =>
                    setUserProfileData({
                         ...userProfileData,
                               bio: e.target.value,
                                 })
                       }  id='bio'/>
                      </div>
                      <div>
                      <label htmlFor='currPost'>Current Post: </label>
                      <input className={styles.editName} type='text' value={userProfileData?.currentPost} 
                      onChange={(e) =>
                         setUserProfileData({
                     ...userProfileData,
                       currentPost: e.target.value,
                         })}   id='currPost'/>
                      </div>
                       
                      <div
                           className={styles.doneButton}
                           onClick={!loading ? handleUploadProfileData : undefined}>
                            {loading ? "Updating..." : "Done"}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>


                                </div>

                       
                    </div>
                </div>
                }

                {/* Edit work */}

                {
                    (editWork == true) &&
                    <div onClick={()=>{
                        setEditWork(false)
                    }}
                    className={styles.editProfileContainer}>
                    <div onClick={(e)=>{
                        e.stopPropagation()
                    }}
                    className={styles.editProfileSection}>
                    <h3>Add Work</h3>
                    <div>
                    <label htmlFor='company'>Company: </label>
                       <input name='company' id='company'
                           type="text"
                           placeholder='Add org name'
                            onChange={handleWorkInputChange}
                           />

                      </div>
                      
                      
                      <div>
                      <label htmlFor='position'>Position: </label>
                     <input name='position' id='position'
                           type="text"
                           placeholder='Add position'
                            onChange={handleWorkInputChange}
                           />
                      </div>
                      <div>
                      <label htmlFor='years'>Years: </label>
                      <input name='years' id='years'
                           type="text"
                           placeholder='Years you worked'
                            onChange={handleWorkInputChange}
                           />
                      </div>
                          {errorMessage && <p style={{ color:"red", marginTop:"0"}}>{errorMessage}</p>}

                      <div
                           className={styles.doneButton}
                           onClick={() => {
                             const updatedData = {
                              ...userProfileData,
                            pastWork: [...userProfileData.pastWork, inputData],
                              };

                              setUserProfileData(updatedData);
                              handleUploadWorkData(updatedData);
                                }}
                               >
                            {loading ? "Updating..." : "Update"}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
                                </div>

                       
                    </div>
                </div>
                }

                {/* Edit education */}
               {
                    (editEducation == true) &&
                    <div onClick={()=>{
                        setEditEducation(false)
                    }}
                    className={styles.editProfileContainer}>
                    <div onClick={(e)=>{
                        e.stopPropagation()
                    }}
                    className={styles.editProfileSection}>
                    <h3>Edit Profile</h3>
                    <div>
                    <label htmlFor='school'>School/College: </label>
                       <input name='school' id='school'
                           type="text"
                           placeholder='Add school/college name'
                            onChange={handleEduInputChange}
                           />
                      </div>
                      <div>
                      <label htmlFor='degree'>Degree: </label>
                       <input name='degree' id='degree'
                           type="text"
                           placeholder='Add degree'
                            onChange={handleEduInputChange}
                           />

                      </div>
                      <div>
                      <label htmlFor='fieldOfStudy'>Field Of Study: </label>
                       <input name='fieldOfStudy' id='fieldOfStudy'
                           type="text"
                           placeholder='Add field'
                            onChange={handleEduInputChange}
                           />
                      </div>
                      
                     
                          {errorMessage && <p style={{ color:"red", marginTop:"0"}}>{errorMessage}</p>}

                      <div
                           className={styles.doneButton}
                           onClick={() => {
                             const updatedData = {
                              ...userProfileData,
                            education: [...userProfileData.education, eduData],
                              };

                              setUserProfileData(updatedData);
                              handleUploadEduData(updatedData);
                                }}>
                            {loading ? "Updating..." : "Update"}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
                                </div>

                       
                    </div>
                </div>
                }

            <div className={styles.profileStats}>
              <h3>Activity</h3>
              {userPosts.length === 0 && (
                <p className={styles.para}>No posts created yet</p>
              )}
             
              {userPosts.map((post)=>{
                return (
                  <div key={post._id}  className={styles.postCard}>

                    <div className={styles.card}>
                <div className={styles.profileContainer}>
                {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt="Post Media" className={styles.postMedia}/>
                 : <div> <img src={`${BASE_URL}/default_post_image.png`} alt="Default Post Media" className={styles.postMedia}/></div>}
                  </div>
                  <p>{post.body}</p>
                
                </div>
                </div>
                );
              })}
           </div>
           
     
    </div>
        </div> }
      </DashboardLayout>
    </UserLayout>
  )
}


