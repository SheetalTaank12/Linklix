import { Router } from "express";
import { activeCheck, commentPost, createPost, deleteComment, deletePost, getAllPosts, getCommentsByPost, increment_likes } from "../controllers/posts.controller.js";
import multer from "multer";


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
router.route('/').get(activeCheck);

router.route('/create_post').post(upload.single('media'),createPost);
router.route('/posts').get(getAllPosts);

router.route('/delete_post').delete(deletePost);

router.route('/comment').post(commentPost);

router.route('/get_comments_by_post').get(getCommentsByPost);

router.route('/delete_comment').post(deleteComment);

router.route('/like').post(increment_likes);


export default router;