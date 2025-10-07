import express from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes.js'

const app = express();
app.use(express.static('public'));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/EYT")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error: ", err));

app.use("/tasks", taskRoutes);

app.listen(3000, () => console.log("http://localhost:3000"));