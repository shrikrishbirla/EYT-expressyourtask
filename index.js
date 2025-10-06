import express from "express";
import mongoose from "mongoose";
const app = express();
app.use(express.static('public'));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/EYT")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error: ", err));

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model("Task", taskSchema);


app.get('/tasks', async (request, response) => {
    try {
        const tasks = await Task.find();
        response.json(tasks);
    } catch (error) {
        response.status(500).json({ error: 'Server error' });
    }
})

app.post('/tasks', async (request, response) => {
    try {
        const { task } = request.body;
        if (!task) return response.status(400).json({ error: 'Task required' });
        const newTask = new Task({ task });
        await newTask.save();
        response.status(201).json(newTask);        
    } catch (error) {
        response.status(500).json({error: 'Server error'})
    }
});

app.delete('/tasks/:id', async (request, response) => {
    try {
        const deleted = await Task.findByIdAndDelete(request.params.id);
        if (!deleted) return response.status(404).json({ error: "Task not found" });
        response.json(deleted);
    } catch (error) {
        response.status(500).json({ error: "Server error" });
    }
});

app.patch('/tasks/:id', async (request, response) => {
    try {
        const updated = await Task.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (!updated) return response.status(404).json({ error: "Task not found" });
        response.json(updated);
    } catch (error) {
        response.status(500).json({ error: "Server error" });
    }
});

app.listen(3000, () => console.log("http://localhost:3000"));