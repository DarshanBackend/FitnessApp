import express from "express";
import {
    addMuscularEnduranceCrunch,
    getMuscularEnduranceCrunchById,
    getAllMuscularEnduranceCrunch,
    updateMuscularEnduranceCrunch,
    deleteMuscularEnduranceCrunch,
} from "../controllers/MuscularEnduranceCrunchController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";
import { checkMemberAccess } from "../middlewares/accessControl.js";

const muscularEnduranceCrunchRouter = express.Router();

// Only trainers can add, update, delete, and view all muscular endurance crunch records
muscularEnduranceCrunchRouter.post("/addMuscularEnduranceCrunch", TrainerAuth, isAdmin, addMuscularEnduranceCrunch);
muscularEnduranceCrunchRouter.put("/updateMuscularEnduranceCrunch/:id", TrainerAuth, isAdmin, updateMuscularEnduranceCrunch);
muscularEnduranceCrunchRouter.delete("/deleteMuscularEnduranceCrunch/:id", TrainerAuth, isAdmin, deleteMuscularEnduranceCrunch);
muscularEnduranceCrunchRouter.get("/getAllMuscularEnduranceCrunch", TrainerAuth, isAdmin, getAllMuscularEnduranceCrunch);

// Members can only view their own muscular endurance crunch records
muscularEnduranceCrunchRouter.get("/getMuscularEnduranceCrunchById/:id", TrainerAuth, checkMemberAccess, getMuscularEnduranceCrunchById);

export default muscularEnduranceCrunchRouter;