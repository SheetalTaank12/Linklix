import { getAllUsers } from '@/config/redux/action/authAction';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import styles from './index.module.css';
import { BASE_URL } from "@/config";
import { useRouter } from 'next/router';

export default function DiscoverPage() {


    const authState = useSelector((state)=>
        state.auth)

    const dispatch = useDispatch();

    useEffect(()=>{ 
     if(!authState.all_profiles_fetched){
        dispatch(getAllUsers());
     }

    },[])

    const router = useRouter();

  return (
   <UserLayout>
            <DashboardLayout>

                <div className={styles.discoverContainer}>
                    <h1 className={styles.discoverHeader}><p>Discover</p></h1>
                    <div className={styles.allUserProfiles}>
                    {
                        authState?.all_users && authState?.all_users.filter((user) => user?.userId?._id !== authState?.user?.userId?._id).map((user)=>(
                            <div onClick={()=>{
                                router.push(`/view_profile/${user?.userId?.username}`)
                            }}
                             key={user?._id} className={styles.userCard}>
                                <img src={`${BASE_URL}/${user?.userId?.profilePicture}` || './images/default.jpg'} alt="" className={styles.profilePicture}/>
                                <div className={styles.userInfo}>
                                <h3>{user?.userId?.name}</h3>
                                <p>@{user?.userId?.username}</p>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </DashboardLayout>
        </UserLayout>
  )
}
