import Post from "../models/posts.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import Comment from "../models/comments.model.js";
export const activeCheck = async(req,res) =>{

    return res.status(200).json({message:"RUNNING"});
}




export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let mediaUrl = "";
    let publicId = "";
    let fileType = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "linklix/posts" }
      );

      mediaUrl = result.secure_url;
      publicId = result.public_id;
      fileType = req.file.mimetype.split("/")[1];
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: mediaUrl,        // now storing URL
      mediaPublicId: publicId,
      fileType: fileType
    });

    await post.save();

    return res.status(200).json({ message: "Post Created" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



export const getAllPosts= async(req,res)=>{
    try{
        const posts = await Post.find().populate('userId','name username email profilePicture');
        return res.json({ posts });

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}
 


export const deletePost = async(req,res)=>{
    const {token, post_id} = req.body;
    try{
// Find user by token and fetch only the user's _id
// We only need _id, so other fields are excluded for security and efficiency
        const user = await User.findOne({token: token}).select("_id");


        if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({_id: post_id});

    if(!post){
        return res.status(404).json({message: "Post not found"});
    }

    //check whether the user is trying to delete his own post or someone else's
    if(post.userId.toString()!== user._id.toString()){
        return res.status(401).json({message: "Unauthorized"});
    }

    await Post.deleteOne({ _id: post_id});

    return res.json({message: "Post deleted"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}




export const commentPost = async(req,res)=>{
    const {token, post_id, commentBody}= req.body;
    try{
       const user = await User.findOne({token: token}).select("_id");
         if (!user) {
              return res.status(404).json({ message: "User not found" });
            }
       const post = await Post.findOne({_id: post_id});
       if(!post){
        return res.status(404).json({message: "Post not found"});
       }
       

       const comment = new Comment({
        userId: user._id,
        postId: post_id,  // we can also write postId: post._id, it is even better as it is saved in db , but both post_id and post._id contain same value so either can be used
        body: commentBody

       });

       await comment.save();

       return res.status(200).json({message: "Comment added"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}



export const getCommentsByPost= async(req,res)=>{
    const {post_id} = req.query;
    try{
     const post = await Post.findOne({_id: post_id});
     if(!post){
        return res.status(404).json({message: "Post not found"});
     }
    const comments = await Comment.find({ postId: post_id }).populate('userId','name username email profilePicture');
    return res.json({ comments });


    }catch(err){
        return res.status(500).json({message: err.message});
    }
}


export const deleteComment= async(req,res)=>{
    const{token, comment_id}= req.body;
    try{
    const user = await User.findOne({token: token}).select("_id");
        if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await Comment.findOne({_id: comment_id});
    if(!comment){
        return res.status(404).json({message: "Comment not found"});
    }

    if(comment.userId.toString()!== user._id.toString()){
        return res.status(401).json({message:"Unauthorized"});
    }

    await Comment.deleteOne({_id: comment_id});

    return res.json({message: "Comment Deleted"});

    }catch(err){
        return res.status(500).json({message:err.message});
    }
}



export const toggleLikePost = async (req, res) => {
  const { token, postId } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = user._id.toString();

    // Check if already liked
    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter(
        id => id.toString() !== userId
      );
    } else {
      // Like
      post.likes.push(user._id);
    }

    await post.save();

    return res.json({
      message: "Like status updated",
      likes: post.likes.length
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
