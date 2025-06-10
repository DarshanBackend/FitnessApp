import express from "express";
import {
    addWorkout,
    getWorkoutById,
    getAllWorkout,
    updateWorkout,
    deleteWorkout,
} from "../controllers/workoutController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const workoutRouter = express.Router();

// Only trainers can add, update, and delete
workoutRouter.post("/addWorkout", TrainerAuth, isAdmin, addWorkout);
workoutRouter.put("/updateWorkout/:id", TrainerAuth, isAdmin, updateWorkout);
workoutRouter.delete("/deleteWorkout/:id", TrainerAuth, isAdmin, deleteWorkout);

// Both trainers and members can view
workoutRouter.get("/getWorkoutById/:id", TrainerAuth, getWorkoutById);
workoutRouter.get("/getAllWorkout", TrainerAuth, getAllWorkout);

export default workoutRouter; 