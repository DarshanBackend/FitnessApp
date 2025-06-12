import express from "express";
import {
    addmuscularStrength,
    getmuscularStrengthById,
    getAllmuscularStrength,
    updatemuscularStrength,
    deletemuscularStrength,
} from "../controllers/MuscularStrengthController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";
import { checkMemberAccess } from "../middlewares/accessControl.js";

const muscularStrengthRouter = express.Router();

// Only trainers can add, update, delete, and view all muscular strength records
muscularStrengthRouter.post("/addMuscularStrength", TrainerAuth, isAdmin, addmuscularStrength);
muscularStrengthRouter.put("/updateMuscularStrength/:id", TrainerAuth, isAdmin, updatemuscularStrength);
muscularStrengthRouter.delete("/deleteMuscularStrength/:id", TrainerAuth, isAdmin, deletemuscularStrength);
muscularStrengthRouter.get("/getAllMuscularStrength", TrainerAuth, isAdmin, getAllmuscularStrength);

// Members can only view their own muscular strength records
muscularStrengthRouter.get("/getMuscularStrengthById/:id", TrainerAuth, checkMemberAccess, getmuscularStrengthById);

export default muscularStrengthRouter;
