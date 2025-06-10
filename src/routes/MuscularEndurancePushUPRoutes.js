import express from "express";
 import {
    addMuscularEndurancePushUP,
    getMuscularEndurancePushUPById,
    getAllMuscularEndurancePushUP,
    updateMuscularEndurancePushUP,
    deleteMuscularEndurancePushUP,
} from "../controllers/MuscularEndurancePushUPController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const muscularEndurancePushUPRouter = express.Router();

// Only trainers can add, update, and delete
muscularEndurancePushUPRouter.post("/addMuscularEndurancePushUP", TrainerAuth, isAdmin, addMuscularEndurancePushUP);
muscularEndurancePushUPRouter.put("/updateMuscularEndurancePushUP/:id", TrainerAuth, isAdmin, updateMuscularEndurancePushUP);
muscularEndurancePushUPRouter.delete("/deleteMuscularEndurancePushUP/:id", TrainerAuth, isAdmin, deleteMuscularEndurancePushUP);

// Both trainers and members can view
muscularEndurancePushUPRouter.get("/getMuscularEndurancePushUPById/:id", TrainerAuth, getMuscularEndurancePushUPById);
muscularEndurancePushUPRouter.get("/getAllMuscularEndurancePushUP", TrainerAuth, getAllMuscularEndurancePushUP);

export default muscularEndurancePushUPRouter;
