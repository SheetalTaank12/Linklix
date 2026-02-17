import { Router } from "express";

import upload from "../middlewares/upload.js";
import { acceptConnectionRequest, downloadProfile, getAllConnections, getAllUserProfile, getMyConnectionRequests, getUpcomingRequests, getUserAndProfile, getUserProfileByUsername, login, register, sendConnectionRequest,deleteConnectionRequest, updateProfileData, updateUserProfile, uploadProfilePicture, getMe,rejectConnectionRequest,removeConnection,deleteWorkInfo,deleteEducationInfo} from "../controllers/user.controller.js";



const router = Router();


//register on worklynk
router.route('/register').post(register);
//login
router.route('/login').post(login);
//update profile pic
router.route("/update_profile_picture").post(upload.single("profile_picture"),uploadProfilePicture);
//update username and email
router.route('/user_update').post(updateUserProfile);
//get user profile for updating other kinds of info
router.route('/get_user_and_profile').get(getUserAndProfile);

router.route('/update_profile_data').post(updateProfileData);

router.route('/get_all_users').get(getAllUserProfile);

router.route('/download_resume').get(downloadProfile);

router.route('/send_connection_request').post(sendConnectionRequest);

router.route('/delete_connection_request').delete(deleteConnectionRequest);

router.route('/get_connection_requests').get(getMyConnectionRequests);

router.route('/get_upcoming_requests').get(getUpcomingRequests);

router.route('/accept_connection_request').post(acceptConnectionRequest);

router.route('/reject_connection_request').delete(rejectConnectionRequest);

router.route('/remove_connection').delete(removeConnection);

router.route('/get_all_connections').get(getAllConnections);

router.route('/get_user_based_on_username').get(getUserProfileByUsername);

router.get("/auth/me", getMe);

router.route("/delete_work").delete(deleteWorkInfo);

router.route("/delete_edu").delete(deleteEducationInfo);


export default router;