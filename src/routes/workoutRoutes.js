import express from "express";
import {
    addWorkout,
    getWorkoutsByDay,
    getAllWorkout,
    updateWorkout,
    updateWorkoutByDay,
    deleteWorkoutsByDay,
} from "../controllers/workoutController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const workoutRouter = express.Router();

// Only trainers can add, update, and delete workouts
workoutRouter.post("/addWorkout", TrainerAuth, isAdmin, addWorkout);
workoutRouter.put("/updateWorkout/:id", TrainerAuth, isAdmin, updateWorkout);
workoutRouter.put("/updateWorkoutByDay/:day", TrainerAuth, isAdmin, updateWorkoutByDay);
workoutRouter.delete("/deleteWorkoutsByDay/:day", TrainerAuth, isAdmin, deleteWorkoutsByDay);

// Both trainers and members can view workouts
// Trainers can view any member's workouts by providing memberId in query
// Members can only view their own workouts
workoutRouter.get("/getWorkoutsByDay/:day", TrainerAuth, getWorkoutsByDay);
workoutRouter.get("/getAllWorkout", TrainerAuth, getAllWorkout);

export default workoutRouter;