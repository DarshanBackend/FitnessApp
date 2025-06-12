import express from "express";
import {
    addMuscularEndurancePushUP,
    getMuscularEndurancePushUPById,
    getAllMuscularEndurancePushUP,
    updateMuscularEndurancePushUP,
    deleteMuscularEndurancePushUP,
} from "../controllers/MuscularEndurancePushUPController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";
import { checkMemberAccess } from "../middlewares/accessControl.js";

const muscularEndurancePushUPRouter = express.Router();

// Only trainers can add, update, delete, and view all muscular endurance push-up records
muscularEndurancePushUPRouter.post("/addMuscularEndurancePushUP", TrainerAuth, isAdmin, addMuscularEndurancePushUP);
muscularEndurancePushUPRouter.put("/updateMuscularEndurancePushUP/:id", TrainerAuth, isAdmin, updateMuscularEndurancePushUP);
muscularEndurancePushUPRouter.delete("/deleteMuscularEndurancePushUP/:id", TrainerAuth, isAdmin, deleteMuscularEndurancePushUP);
muscularEndurancePushUPRouter.get("/getAllMuscularEndurancePushUP", TrainerAuth, isAdmin, getAllMuscularEndurancePushUP);

// Members can only view their own muscular endurance push-up records
muscularEndurancePushUPRouter.get("/getMuscularEndurancePushUPById/:id", TrainerAuth, checkMemberAccess, getMuscularEndurancePushUPById);

export default muscularEndurancePushUPRouter;
