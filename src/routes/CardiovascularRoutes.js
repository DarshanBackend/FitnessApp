import express from "express";
import {
    addCardiovascular,
    getCardiovascularById,
    getAllCardiovascular,
    updateCardiovascular,
    deleteCardiovascular,
} from "../controllers/CardiovascularController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";
import { checkMemberAccess } from "../middlewares/accessControl.js";

const cardiovascularRouter = express.Router();

// Only trainers can add, update, delete, and view all cardiovascular records
cardiovascularRouter.post("/addCardiovascular", TrainerAuth, isAdmin, addCardiovascular);
cardiovascularRouter.put("/updateCardiovascular/:id", TrainerAuth, isAdmin, updateCardiovascular);
cardiovascularRouter.delete("/deleteCardiovascular/:id", TrainerAuth, isAdmin, deleteCardiovascular);
cardiovascularRouter.get("/getAllCardiovascular", TrainerAuth, isAdmin, getAllCardiovascular);

// Members can only view their own cardiovascular records
cardiovascularRouter.get("/getCardiovascularById/:id", TrainerAuth, checkMemberAccess, getCardiovascularById);

export default cardiovascularRouter;