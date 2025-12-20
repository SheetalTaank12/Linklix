import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());


app.use("/posts", postRoutes);
app.use("/user", userRoutes);

app.use(express.static("uploads"));

const start = async()=>{
    const connectDB= await mongoose.connect(process.env.MONGO_URI);

    app.listen(8090,()=>{
        console.log("server is listening on port 8090");
    });

}

start();