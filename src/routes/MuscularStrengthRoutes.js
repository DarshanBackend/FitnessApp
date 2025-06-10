import express from "express";
import {
    addmuscularStrength,
    getmuscularStrengthById,
    getAllmuscularStrength,
    updatemuscularStrength,
    deletemuscularStrength,
} from "../controllers/MuscularStrengthController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const muscularStrengthRouter = express.Router();

// Only trainers can add, update, and delete
muscularStrengthRouter.post("/addmuscularStrength", TrainerAuth, isAdmin, addmuscularStrength);
muscularStrengthRouter.put("/updatemuscularStrength/:id", TrainerAuth, isAdmin, updatemuscularStrength);
muscularStrengthRouter.delete("/deletemuscularStrength/:id", TrainerAuth, isAdmin, deletemuscularStrength);

// Both trainers and members can view
muscularStrengthRouter.get("/getmuscularStrengthById/:id", TrainerAuth, getmuscularStrengthById);
muscularStrengthRouter.get("/getAllmuscularStrength", TrainerAuth, getAllmuscularStrength);

export default muscularStrengthRouter;
