import express from "express";
import {
    addCardiovascular,
    getCardiovascularById,
    getAllCardiovascular,
    updateCardiovascular,
    deleteCardiovascular,
} from "../controllers/CardiovascularController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const cardiovascularRouter = express.Router();

// Only trainers can add, update, and delete
cardiovascularRouter.post("/addCardiovascular", TrainerAuth, isAdmin, addCardiovascular);
cardiovascularRouter.put("/updateCardiovascular/:id", TrainerAuth, isAdmin, updateCardiovascular);
cardiovascularRouter.delete("/deleteCardiovascular/:id", TrainerAuth, isAdmin, deleteCardiovascular);

// Both trainers and members can view
cardiovascularRouter.get("/getCardiovascularById/:id", TrainerAuth, getCardiovascularById);
cardiovascularRouter.get("/getAllCardiovascular", TrainerAuth, getAllCardiovascular);

export default cardiovascularRouter;