import Task from "../models/taskModel.js";

export const getTasks = async (request, response) => {
    try {
        const tasks = await Task.find();
        response.json(tasks);
    } catch (error) {
        response.status(500).json({ error: 'Server error' });
    }
}

export const createTask = async (request, response) => {
    try {
        const { task } = request.body;
        if (!task) return response.status(400).json({ error: 'Task required' });
        const newTask = new Task({ task });
        await newTask.save();
        response.status(201).json(newTask);        
    } catch (error) {
        response.status(500).json({error: 'Server error'})
    }
}

export const deleteTask = async (request, response) => {
    try {
        const deleted = await Task.findByIdAndDelete(request.params.id);
        if (!deleted) return response.status(404).json({ error: "Task not found" });
        response.json(deleted);
    } catch (error) {
        response.status(500).json({ error: "Server error" });
    }
}

export const updateTask = async (request, response) => {
    try {
        const updated = await Task.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (!updated) return response.status(404).json({ error: "Task not found" });
        response.json(updated);
    } catch (error) {
        response.status(500).json({ error: "Server error" });
    }
}