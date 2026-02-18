import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

function LoginComponent() {

    const authState = useSelector((state)=> state.auth);

    const router = useRouter();
    const dispatch = useDispatch();

    const [userLoginMethod, setUserLoginMethod] = useState(false);
    // the userLoginMethod checks whether the user is logging in or registering.
    // false means the user is registering, true means the user is logging in.
    // By default, it is set to false, so the registration form is shown first.
    // means it is true when the user already has an account and wants to log in.
    // but initially it is false, so the sign-up form is shown first.

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");


    useEffect(() =>{
        if (authState.loggedIn){
            router.push('/dashboard')
        }
    }, [authState.loggedIn])
    // useEffect helps to perform side effects in functional components.
    // In simple terms, we can use useEffect to run some code
    //  when the component mounts, updates, or unmounts.
    // Here, we are using useEffect to monitor changes to authState.loggedIn.
    // When authState.loggedIn changes (for example, when a user successfully logs in),
    // the effect will run and redirect the user to the '/dashboard' page using router.push('/dashboard').
    
// the array [authState.loggedIn] is the dependency array.
// It tells React to only run the effect when authState.loggedIn changes.
// If we left the dependency array empty ([]), the effect would only run once when the component mounts.
// If we omitted the dependency array altogether, the effect would run after every render, which could lead to unnecessary redirects.

    useEffect(()=>{
        if(localStorage.getItem("token")){
            router.push('/dashboard')
        }

    },[])
 
    useEffect(() =>{
        dispatch(emptyMessage())
    }, [userLoginMethod])

    const handleRegister =()=>{
        
        dispatch(registerUser({username, password,email, name}));

    }

    const handleLogin =()=>{
       
        dispatch(loginUser({email,password}));
    }
    return (

        <UserLayout>

            <div className={styles.container}>
        <div className={styles.cardContainer}>
            <div className={styles.cardContainer_left}>
                <p className={styles.cardLeft_heading}> {userLoginMethod? "Sign In": "Sign Up"}</p>
                <p style={{ color: authState.isError ? "red" : "green" }}>{authState?.message}</p>

                <div className={styles.inputContainer}>
                    
                    {!userLoginMethod&& <div className={styles.inputRow}>
                <input onChange={(e)=>{
                    setUsername(e.target.value)
                }} className={styles.inputField} type='text' placeholder='Username'/>
                <input onChange={(e)=>{
                    setName(e.target.value)
                }} className={styles.inputField} type='text' placeholder='Name'/>
                </div>}


                <input onChange={(e)=>{
                    setEmail(e.target.value)
                }} className={styles.inputField} type='email' placeholder='Email'/>
                <input onChange={(e)=>{
                    setPassword(e.target.value)
                }} className={styles.inputField} type='password' placeholder='Password'/>


                <div className={styles.signUpBtn} onClick={()=>{
                    if(userLoginMethod){

                       handleLogin();
                    }else{
                        handleRegister();

                    }
                }}>
                    <p>{userLoginMethod? "Sign In" : "Sign Up"}</p>
                </div>

                </div>

            </div>
            <div className={styles.cardContainer_right}>
                <div>
                    {userLoginMethod? <h3>Don't Have an Account ?</h3> : 
                    <h3>Already Have An Account ?</h3>}
                    <div onClick={()=>{
                        setUserLoginMethod(!userLoginMethod)
                    }} className={styles.signUpBtn} style={{textAlign: "center"}}>
                        <p>{userLoginMethod? "Sign Up" : "Sign In"}</p>

                    </div>
                </div>

            </div>

        </div>
        </div>
        </UserLayout>
    )
}

export default LoginComponent;