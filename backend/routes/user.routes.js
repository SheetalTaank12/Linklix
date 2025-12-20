import { Router } from "express";
import multer from "multer";
import { acceptConnectionRequest, downloadProfile, getAllConnections, getAllUserProfile, getMyConnectionRequests, getUpcomingRequests, getUserAndProfile, login, register, sendConnectionRequest, updateProfileData, updateUserProfile, uploadProfilePicture } from "../controllers/user.controller.js";



const router = Router();

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname)
    }
});

const upload = multer({ storage: storage });


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

router.route('/update_profile_data',updateProfileData);

router.route('/get_all_users').get(getAllUserProfile);

router.route('/download_resume').get(downloadProfile);

router.route('/send_connection_request').post(sendConnectionRequest);

router.route('/get_connection_requests').get(getMyConnectionRequests);

router.route('/get_upcoming_requests').get(getUpcomingRequests);

router.route('/accept_connection_request').post(acceptConnectionRequest);

router.route('/get_all_connections').get(getAllConnections);

export default router;