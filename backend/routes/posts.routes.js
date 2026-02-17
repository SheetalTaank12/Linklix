import { Router } from "express";
import { activeCheck, commentPost, createPost, deleteComment, deletePost, getAllPosts, getCommentsByPost, toggleLikePost } from "../controllers/posts.controller.js";
import upload from "../middlewares/upload.js";


const router = Router();

router.route('/').get(activeCheck);

router.route('/create_post').post(upload.single('post_media'),createPost);
router.route('/get_posts').get(getAllPosts);

router.route('/delete_post').delete(deletePost);

router.route('/comment').post(commentPost);

router.route('/get_comments_by_post').get(getCommentsByPost);

router.route('/delete_comment').delete(deleteComment);

router.route("/toggle_like").post(toggleLikePost);

export default router;