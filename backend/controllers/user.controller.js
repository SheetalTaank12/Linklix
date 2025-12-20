
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import ConnectionRequest from "../models/connections.model.js";
import crypto from 'crypto';
import bcrypt from "bcrypt";
import PDFdocument from 'pdfkit';
import fs from 'fs';

import Post from "../models/posts.model.js";


const convertUserDataToPDF= async(userData)=>{
    const doc = new PDFdocument();

    const outputPath = crypto.randomBytes(32).toString("hex")+".pdf";
    const stream = fs.createWriteStream("uploads/"+outputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`,{align: "center",width:100});
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);


    doc.fontSize(14).text("Past work: ");
    userData.pastWork.forEach((work,index) => {

        doc.fontSize(14).text(`Company Name: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years : ${work.years}`);
        
    });

    doc.end();

    return outputPath;
}





//register on linklix
export const register = async(req,res)=>{
    try{
     //Works because: req.body has keys called name, email, password, username
        const {name,email,password,username}= req.body;


//         If you want different variable names, you must map them:
// const { name: Name, email: Email, password: pass, username: usrname} = req.body;

        if(!name|| !email || !password || !username){
            return res.status(400).json({message: "All files are required"});
        }


// and how do we know what is inside req.body -> the values will come from frontend !

//  But When you design backend first, YOU decide what goes inside req.body.
// req.body is not magical. It doesn’t come with predefined keys.
// Think of backend-first like this. You are writing rules, not guessing data. 
// You are basically saying:“If anyone wants to register a user, they MUST send me these fields.”



        const user = await User.findOne({
            email
        });

        if(user) return res.status(400).json({message: "User already exists!"});

        // Converts the plain password into a secure hashed version using bcrypt.
// "10" defines the strength (number of hashing rounds).
// The hash includes a random salt, so the original password cannot be recovered.

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            username
        });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id});

        await profile.save();

        return res.json({message : "User Created"});


    }catch(err){
        return res.status(500).json({message:err.message});
    }
}



//login to linklix
export const login= async(req,res)=>{
    try{
        const {email,password}= req.body;

        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const user =await User.findOne({
            email
        });

        if(!user){
            return res.status(404).json({message: "User does not exist"});
        }

// Compares the entered password with the stored hashed password.
// bcrypt uses the same salt and rounds from the stored hash to verify the password.

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});


// Generate a secure random token and convert it to a readable hex string with .toString
//It creates a long, random, hard-to-guess string called a token.
//This token is: Unique, Random, Secure, Almost impossible to guess      

        const token =crypto.randomBytes(32).toString("hex");



        await User.updateOne({_id : user._id},{ token });
// When you do: await User.updateOne({ _id: user._id }, { token });
// JS interprets this shorthand as: { token: token }
// Left-hand side (token) → schema field name
// Right-hand side (token) → JS variable storing the crypto value


// We use $set in updateOne function in raw MongoDB not in mongoose code
// Mongoose automatically wraps the fields in $set
// Raw MongoDB: db.collection.updateOne(filter, update)
// Mongoose: Model.updateOne(filter, update)



        return res.json({ token: token });
    } catch(err){
        return res.status(500).json({message:err.message});

    }
}



//almost all controllers ahead use token to check whether a user is logged in becoz tokens are used for
// login session
//so we will convert this repeated task into middleware later


//upload profile picture 
export const uploadProfilePicture= async(req,res)=>{
    const {token} = req.body;

    try{

        const user = await User.findOne({token: token});
        
        if(!user){
            return res.status(404).json({message: "User not found"});
        }


// req.file.filename is set by Multer (customizable)
//When a file is uploaded, Multer creates a req.file object (for single file) or req.files (for multiple files).

//sample req.file looks like 
// req.file = {
//   fieldname: 'profilePicture',     // The name attribute in HTML form
//   originalname: 'myphoto.jpg',     // Original file name uploaded by user
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'uploads/',          // Folder where Multer saved the file
//   filename: '1699999999999-myphoto.jpg',  // Generated file name (this is what Multer set)
//   path: 'uploads/1699999999999-myphoto.jpg',
//   size: 34567
// }


        user.profilePicture= req.file.filename;
        await user.save();

        return res.json({message:"Profile Picture Updated"});

    }catch(err){
   return res.status(500).json({message: err.message});
    }
}



//update username and email
export const updateUserProfile= async(req,res)=>{
    try{

        //It takes token out of req.body and puts everything else into newUserData.
        const {token, ...newUserData}= req.body;

        const user = await User.findOne({token: token});

        if(!user){
            return res.status(404).json({message:"User not found"});

        }
        

        //if the user is logged in, then we extract the new username and email which he wants to set in place of old info, from the req parameter
        const {username, email}= newUserData;

        // then we find if the new values of username and email already exist in database, which the current user is willing to set as his own
        // we get result in the existingUser variable as true or false
        const existingUser = await User.findOne({$or: [{username}, {email}]});
        

        //if we get true in existingUser , it means the username and email already exist in database...
        // but we also have to check one more condition 
        // we will check if the username and email in the database are used by another user or the current user

        // this is becoz if they are used by the current user who is updating, then we will allow him to update becoz he can change or keep them same 
        // but if the new values are taken up by any other user, then the current user cannot use them as his own.. SIMPLE !

        // if existingUser is false this loop is skipped simply and the user updates info
        // if existingUser is true, we check whether id of existingUser and user match...
        // if ids match it means the user is same who exists and who is updating, so loop gets skipped
        //if ids don't match means both are different users and we cannot allow the current user to update using those values!
        
        if (existingUser && String(existingUser._id) !== String(user._id)) {
  return res.status(400).json({ message: "User already exists" });
}


        Object.assign(user, newUserData);

        await user.save();

        return res.json({message : "User updated"});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}



//get profile info including name, email, username, profilepic,bio, currentpost, pastwork, education
export const getUserAndProfile= async(req,res)=>{
    
    try{

      //  GET request → req.query , POST request → req.body
        const { token } = req.query;
// we can also write  const token = req.query.token;  but it is not modern method

        const user = await User.findOne({token: token});

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

   //This code fetches a user’s profile and automatically replaces userId 
   // with the user’s other details which exist in its user model, and only wanted info like name email etc is placed, although user model has other things too..

   // it means now the field userId in profile is updated and also contains other info which is in populate method, so now a full better profile is formed

   // so now we get the user profile, fetching info from profile model, and adding some other to it which is in user model
   // hence making a full profile
        const userProfile = await Profile.findOne({userId: user._id})
           .populate("userId", "name email username profilePicture");
       
           return res.json(userProfile);

    } catch(err){
        return res.status(500).json({message: err.message});
    }
}


//update other info in profile
export const updateProfileData = async(req,res)=>{
    try{

        const{token, ...newProfileData}= req.body;

        const user = await User.findOne({token: token});
        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        const profile_to_update = await Profile.findOne({userId: user._id});

        Object.assign(profile_to_update, newProfileData);

        await profile_to_update.save();

        return res.json({message: "Profile Updated"});

    } catch(err){
        return res.status(500).json({message: err.message});
    }
}



//get all users profiles of worklynk
export const getAllUserProfile = async(req,res)=>{
    try{
        const profiles= await Profile.find().populate('userId','name username email profilePicture');

        return res.json(profiles);

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}



// download resume from profile data
export const downloadProfile= async(req,res)=>{
    try{

        const user_id= req.query.id;
        const userProfile = await Profile.findOne({userId: user_id})
        .populate('userId','name username email profilePicture');


        let outputPath = await convertUserDataToPDF(userProfile);

        return res.json({message: outputPath});

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}


//send connection request to someone
export const sendConnectionRequest = async(req,res)=>{
    const {token, connectionId} = req.body;

    try{
         const user = await User.findOne({ token });

         if(!user){
            return res.status(404).json({message: "User not found"});
         }

         const connectionUser = await User.findOne({_id: connectionId});
         if(!connectionUser){
            return res.status(404).json({message: "Connection user not found"});
         }

         const existingRequst = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
         });

         if(existingRequst){
            return res.status(400).json({message: "Request already sent"});
         }

         const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
         });

         await request.save();




    }catch(err){
        return res.status(500).json({message: err.message});
    }
}




//“Give me all requests where I am the request sender.”, which i have sent to all others
export const getMyConnectionRequests= async(req,res)=>{
    const {token} = req.body;
    try{
        const user = await User.findOne({token});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const connectionRequests = await ConnectionRequest.find({userId:user._id})
        .populate('connectionId','name username email profilePicture');

        return res.json({connectionRequests});
    
    }catch(err){
        return res.status(400).json({message: err.message});
    }
}



//“Give me all requests where I am the receiver.”, which people have sent to me
export const getUpcomingRequests = async(req,res)=>{
    const{token}= req.body;
    try{
      const user = await User.findOne({token});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }
     const requests = await ConnectionRequest.find({connectionId: user._id})
     .populate('userId','name username email profilePicture');

     return res.json(requests);
     

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}



//accept or reject connection request
export const acceptConnectionRequest = async(req,res)=>{
    const{ token, requestId, action_type}= req.body;

    try{
        const user = await User.findOne({token});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const request = await ConnectionRequest.findOne({_id: requestId});
        if(!request){
            return res.status(404).json({message: "Connection request not found"});
        }

        if(action_type=== "accept"){
            request.status_accepted= true;
        }else{
            request.status_accepted = false;
        }

        await request.save();
        return res.json({message: "Request updated"});
        

    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

//get all connections 
export const getAllConnections = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      status_accepted: true,
      $or: [
        { userId: user._id },
        { connectionId: user._id }
      ]
    })
    .populate("userId", "name username email profilePicture")
    .populate("connectionId", "name username email profilePicture");

    return res.status(200).json(connections);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

