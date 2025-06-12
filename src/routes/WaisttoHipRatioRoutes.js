import express from "express";
import {
    addWaisttoHipRatio,
    getWaisttoHipRatioById,
    getAllWaisttoHipRatio,
    updateWaisttoHipRatio,
    deleteWaisttoHipRatio,
} from "../controllers/WaisttoHipRatioController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";
import { checkMemberAccess } from "../middlewares/accessControl.js";

const waisttoHipRatioRouter = express.Router();

// Only trainers can add, update, delete, and view all waist to hip ratio records
waisttoHipRatioRouter.post("/addWaisttoHipRatio", TrainerAuth, isAdmin, addWaisttoHipRatio);
waisttoHipRatioRouter.put("/updateWaisttoHipRatio/:id", TrainerAuth, isAdmin, updateWaisttoHipRatio);
waisttoHipRatioRouter.delete("/deleteWaisttoHipRatio/:id", TrainerAuth, isAdmin, deleteWaisttoHipRatio);
waisttoHipRatioRouter.get("/getAllWaisttoHipRatio", TrainerAuth, isAdmin, getAllWaisttoHipRatio);

// Members can only view their own waist to hip ratio records
waisttoHipRatioRouter.get("/getWaisttoHipRatioById/:id", TrainerAuth, checkMemberAccess, getWaisttoHipRatioById);

export default waisttoHipRatioRouter;
