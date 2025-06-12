import express from "express";
import {
    addWorkout,
    getWorkoutById,
    getAllWorkout,
    updateWorkout,
    deleteWorkout,
} from "../controllers/workoutController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";
import { checkMemberAccess } from "../middlewares/accessControl.js";

const workoutRouter = express.Router();

// Only trainers can add, update, delete, and view all workout records
workoutRouter.post("/addWorkout", TrainerAuth, isAdmin, addWorkout);
workoutRouter.put("/updateWorkout/:id", TrainerAuth, isAdmin, updateWorkout);
workoutRouter.delete("/deleteWorkout/:id", TrainerAuth, isAdmin, deleteWorkout);
workoutRouter.get("/getAllWorkout", TrainerAuth, isAdmin, getAllWorkout);

// Members can only view their own workout records
workoutRouter.get("/getWorkoutById/:id", TrainerAuth, checkMemberAccess, getWorkoutById);

export default workoutRouter; 