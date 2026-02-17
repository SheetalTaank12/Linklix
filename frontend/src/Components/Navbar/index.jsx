import React, { useState } from "react";
import styles from './styles.module.css';
import { reset } from "@/config/redux/reducer/authReducer";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
// userRouter is a hook that allows you to programmatically navigate between routes in a Next.js application.
// It provides access to the router object, which contains methods for navigating to different pages, as well as information about the current route
// It gives Access to Next.js routing system inside your component.


import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
// useSelector is a hook provided by the React-Redux library that allows you to extract data from the Redux store state.
// It takes a selector function as an argument, which is called with the entire Redux store state, and returns the selected data.
// It lets a component READ data from the Redux store (global state).
// It does not change anything.
// It only listens.


// useDispatch is a hook provided by the React-Redux library that gives you access to the dispatch function from the Redux store.
// You can use this function to dispatch actions to the Redux store, which will then be processed by the reducers to update the state.

// It lets a component SEND data to the Redux store (global state).
// Redux store = shared notice board
// useSelector = reading the board
// useDispatch = posting a new notice
// You read with useSelector,
// You update with useDispatch.


export default function NavBarComponent() {

    const router= useRouter();

    const dispatch = useDispatch();

    const authState = useSelector((state)=> 
    state.auth)
// Here, we are using the useSelector hook to access the auth slice of the Redux store state.
// This allows us to read the authentication-related data stored in the Redux store,
// such as whether the user is logged in, user information, and other auth-related details.
// In useSelector, state = the ENTIRE Redux store.


//_app.js is the root of your Next.js app — everything passes through it automatically.
// So, if you set up a Redux Provider there,
// the entire app will have access to the Redux store,
// and you can use useSelector and useDispatch in any component throughout your application.
// This is a common pattern for integrating Redux with Next.js applications.
// _app.js defines where the store comes from
// useSelector defines how you read from it





useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    dispatch(setTokenIsThere());
     dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  } 
}, []);
 
    return (
        <div className={styles.container}>
            <nav className={styles.navBar}>
                <h1 onClick={()=>{
                    router.push('/')
                }} style={{cursor:"pointer"}}>LINKLIX</h1>
                <div className={styles.navBarOptionContainer}>


                   {authState?.user ? (
  <div className={styles.userOptions} >
    <p className={styles.heyUser} style={{fontWeight:"bold"}}>Hey, {authState.user.userId?.name}</p>

    <p className={styles.profileBtn}
      style={{ fontWeight: "bold", cursor: "pointer" }}
      onClick={() => router.push("/profile")}
    >
      <span>Profile</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>

    </p>

    <p className={styles.logoutBtn}
      style={{ fontWeight: "bold", cursor: "pointer" }}
      onClick={() => {
        localStorage.removeItem("token");
        dispatch(reset());
        router.push("/login");
      }}
    >
      Logout
    </p>
  </div>
) : (
  <div
    onClick={() => router.push("/login")}
    className={styles.joinBtn}
  >
    <p>Be A Part</p>
  </div>
)}


                </div>

            </nav>



            
        </div>


    



    )
}