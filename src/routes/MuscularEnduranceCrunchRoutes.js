import express from "express";
import {
    addMuscularEnduranceCrunch,
    getMuscularEnduranceCrunchById,
    getAllMuscularEnduranceCrunch,
    updateMuscularEnduranceCrunch,
    deleteMuscularEnduranceCrunch,
} from "../controllers/MuscularEnduranceCrunchController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const muscularEnduranceCrunchRouter = express.Router();

// Only trainers can add, update, and delete
muscularEnduranceCrunchRouter.post("/addMuscularEnduranceCrunch", TrainerAuth, isAdmin, addMuscularEnduranceCrunch);
muscularEnduranceCrunchRouter.put("/updateMuscularEnduranceCrunch/:id", TrainerAuth, isAdmin, updateMuscularEnduranceCrunch);
muscularEnduranceCrunchRouter.delete("/deleteMuscularEnduranceCrunch/:id", TrainerAuth, isAdmin, deleteMuscularEnduranceCrunch);

// Both trainers and members can view
muscularEnduranceCrunchRouter.get("/getMuscularEnduranceCrunchById/:id", TrainerAuth, getMuscularEnduranceCrunchById);
muscularEnduranceCrunchRouter.get("/getAllMuscularEnduranceCrunch", TrainerAuth, getAllMuscularEnduranceCrunch);

export default muscularEnduranceCrunchRouter;