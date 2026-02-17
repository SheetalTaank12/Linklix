

import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";

export default function Home() {

  const authState = useSelector((state)=> state.auth);

    const router = useRouter();

     useEffect(()=>{
            if(localStorage.getItem("token")){
                router.push('/dashboard')
            }
    
        },[])

  return (
    <UserLayout>

    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer_left}>
          <p>Connect with friends and like-minded people</p>
          <p>A True Social media platform with Original Stories</p>
          <div onClick={()=>{
          router.push('/login')
        }} className={styles.joinBtn}>
          <p>Join Now</p>
        </div>
        </div>
        <div className={styles.mainContainer_right}>
          <img src="images/main-img.jpg" alt="img">
          </img>
        </div>
        
      </div>
    </div>
     
    </UserLayout>
  )
}


