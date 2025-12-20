import Head from "next/head";
import Image from "next/image";

import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {

  const router = useRouter();
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


