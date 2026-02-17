import React, { useEffect } from 'react';
import styles from './index.module.css'
import { useRouter } from 'next/router';
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { usePathname } from "next/navigation";



export default function DashboardLayout({children}) {

      const authState = useSelector((state)=> state.auth);

    const router = useRouter();

    const dispatch = useDispatch();

    const pathname= usePathname();

    
        useEffect(()=>{
            if(localStorage.getItem('token') === null)
                router.push('/login');
    
            dispatch(setTokenIsThere());
        });

        

  return (
    <div> 
       
                <div className={styles.homeContainer}>
                    <div className={styles.home_leftBar}>
                        <div onClick={()=>{
                          router.push('/dashboard');
                        }
                         } style={{
          fontWeight: pathname === "/dashboard" ? "bold" : "400", backgroundColor:pathname === "/dashboard" ? "#eee" : "#fff"
        }}
                          className={styles.sideBarOption}>
                            <svg style={{
          strokeWidth: pathname === "/dashboard" ? "2.5" : "1.5"
        }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>

                            <p>Scroll</p>


                        </div>
                        <div onClick={()=>{
                          router.push('/discover');
                        }
                         }style={{
          fontWeight: pathname === "/discover" ? "bold" : "400", backgroundColor:pathname === "/discover" ? "#eee" : "#fff"
        }}
                          className={styles.sideBarOption}>
                            <svg style={{
          strokeWidth: pathname === "/discover" ? "2.5" : "1.5"
        }}
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>


                            <p>Discover</p>


                        </div>
                        <div onClick={()=>{
                          router.push('/my_connections');
                        }
                         } style={{
          fontWeight: pathname === "/my_connections" ? "bold" : "400", backgroundColor:pathname === "/my_connections" ? "#eee" : "#fff"
        }}
                          className={styles.sideBarOption}>
                            <svg style={{
          strokeWidth: pathname === "/my_connections" ? "2.5" : "1.5"
        }}
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                             </svg>


                            <p>My Connections</p>


                        </div>


                         <div onClick={()=>{
                          router.push('/requests');
                        }
                         } style={{
          fontWeight: pathname === "/requests" ? "bold" : "400", backgroundColor:pathname === "/requests" ? "#eee" : "#fff"
        }}
                          className={styles.sideBarOption}>
                            <svg  style={{
          strokeWidth: pathname === "/requests" ? "2.5" : "1.5"
        }}
                              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
</svg>


                            <p>Requests</p>


                        </div>

                    </div>
                    <div className={styles.home_feedContainer}>
                        {children}

                </div>
                <div className={styles.home_extraContainer}>

                    <h3>Top Profiles</h3>
                    {authState.all_profiles_fetched && authState.all_users.map((profile)=>{
                        return (
                            <div key={profile._id} className={styles.extraContainer_profile}>
                                <p>{profile.userId.name}</p>
                            </div>
                        )
                    })}
                    
                </div>

                </div>
                
            
            <div className={styles.mobileNavbar}>
                  <div onClick={()=>{
                          router.push('/dashboard');
                        }
                         } style={{
          fontWeight: pathname === "/dashboard" ? "bold" : "400", backgroundColor:pathname === "/dashboard" ? "#eee" : "#fff"
        }}
                          className={styles.sideBarOption}>
                            <svg style={{
          strokeWidth: pathname === "/dashboard" ? "2.5" : "1.5"
        }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>

                            <p>Home</p>


                        </div>
               
                        <div onClick={()=>{
                          router.push('/discover');
                        }
                         }style={{
          fontWeight: pathname === "/discover" ? "bold" : "400", backgroundColor:pathname === "/discover" ? "#eee" : "#fff"
        }}
                          className={styles.sideBarOption}>
                            <svg style={{
          strokeWidth: pathname === "/discover" ? "2.5" : "1.5"
        }}
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>


                            <p>Discover</p>


                        </div>

                        <div onClick={()=>{
                          router.push('/create_post');
                        }}
                        style={{
          fontWeight: pathname === "/create_post" ? "bold" : "400", backgroundColor:pathname === "/create_post" ? "#eee" : "#fff"
        }}
                         className={styles.sideBarOption}>
                             <svg  style={{
          strokeWidth: pathname === "/create_post" ? "2.5" : "1.5"
        }}
                              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                       </svg>
                             <p>
                            Post
                           </p>
                        </div>


                       <div onClick={()=>{
                          router.push('/my_connections');
                        }
                         } style={{
          fontWeight: pathname === "/my_connections" ? "bold" : "400", backgroundColor:pathname === "/my_connections" ? "#eee" : "#fff"
        }}
                          className={styles.sideBarOption}>
                            <svg style={{
          strokeWidth: pathname === "/my_connections" ? "2.5" : "1.5"
        }}
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                             </svg>


                            <p>Connections</p>


                        </div>


                          <div onClick={()=>{
                          router.push('/requests');
                        }
                         } style={{
          fontWeight: pathname === "/requests" ? "bold" : "400", backgroundColor:pathname === "/requests" ? "#eee" : "#fff"
        }}
                          className={styles.sideBarOption}>
                            <svg  style={{
          strokeWidth: pathname === "/requests" ? "2.5" : "1.5"
        }}
                              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
</svg>


                            <p>Requests</p>


                        </div>
                
            </div>
            </div>
  )
}
