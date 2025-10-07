import express from "express";

import { getTasks, createTask, deleteTask, updateTask } from "../controllers/taskControllers.js";

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.patch("/:id", updateTask);

export default router;
