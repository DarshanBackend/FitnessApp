import express from "express";
import {
    addvo2MaxRockPortTest,
    getvo2MaxRockPortTestById,
    getAllvo2MaxRockPortTest,
    updatevo2MaxRockPortTest,
    deletevo2MaxRockPortTest,
} from "../controllers/Vo2MaxRockPortTestController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const vo2MaxRockPortTestRouter = express.Router();

// Only trainers can add, update, and delete
vo2MaxRockPortTestRouter.post("/addvo2MaxRockPortTest", TrainerAuth, isAdmin, addvo2MaxRockPortTest);
vo2MaxRockPortTestRouter.put("/updatevo2MaxRockPortTest/:id", TrainerAuth, isAdmin, updatevo2MaxRockPortTest);
vo2MaxRockPortTestRouter.delete("/deletevo2MaxRockPortTest/:id", TrainerAuth, isAdmin, deletevo2MaxRockPortTest);

// Both trainers and members can view
vo2MaxRockPortTestRouter.get("/getvo2MaxRockPortTestById/:id", TrainerAuth, getvo2MaxRockPortTestById);
vo2MaxRockPortTestRouter.get("/getAllvo2MaxRockPortTest", TrainerAuth, getAllvo2MaxRockPortTest);

export default vo2MaxRockPortTestRouter;
