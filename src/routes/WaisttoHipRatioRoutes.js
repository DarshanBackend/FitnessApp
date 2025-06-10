import express from "express";
import { addWaisttoHipRatio, getWaisttoHipRatioById, getAllWaisttoHipRatio, updateWaisttoHipRatio, deleteWaisttoHipRatio } from "../controllers/WaisttoHipRatioController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const WaisttoHipRatioRouter = express.Router();

// Only trainers can add, update, and delete
WaisttoHipRatioRouter.post("/addWaisttoHipRatio", TrainerAuth, isAdmin, addWaisttoHipRatio);
WaisttoHipRatioRouter.put("/updateWaisttoHipRatio/:id", TrainerAuth, isAdmin, updateWaisttoHipRatio);
WaisttoHipRatioRouter.delete("/deleteWaisttoHipRatio/:id", TrainerAuth, isAdmin, deleteWaisttoHipRatio);

// Both trainers and members can view
WaisttoHipRatioRouter.get("/getWaisttoHipRatioById/:id", TrainerAuth, getWaisttoHipRatioById);
WaisttoHipRatioRouter.get("/getAllWaisttoHipRatio", TrainerAuth, getAllWaisttoHipRatio);

export default WaisttoHipRatioRouter;
