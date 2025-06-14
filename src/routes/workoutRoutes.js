import express from "express";
import {
    addWorkout,
    getWorkoutsByDay,
    getAllWorkout,
    updateWorkoutById,
    deleteWorkoutById
} from "../controllers/workoutController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const workoutRouter = express.Router();

// Only trainers can add, update, and delete workouts
workoutRouter.post("/addWorkout", TrainerAuth, isAdmin, addWorkout);
workoutRouter.put("/updateWorkoutById/:id", TrainerAuth, isAdmin, updateWorkoutById);
workoutRouter.delete("/deleteWorkoutById/:id", TrainerAuth, isAdmin, deleteWorkoutById);

// Both trainers and members can view workouts
// Trainers can view any member's workouts by providing memberId in query
// Members can only view their own workouts
workoutRouter.get("/getWorkoutsByDay/:day", TrainerAuth, getWorkoutsByDay);
workoutRouter.get("/getAllWorkout", TrainerAuth, getAllWorkout);

export default workoutRouter;