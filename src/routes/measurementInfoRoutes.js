import express from "express";
import {
    addMeasurementInfo,
    getMeasurementInfoById,
    getAllMeasurementInfo,
    updateMeasurementInfo,
    deleteMeasurementInfo,
} from "../controllers/measurementInfoController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";
import { checkMemberAccess } from "../middlewares/accessControl.js";

const measurementInfoRouter = express.Router();

// Only trainers can add, update, delete, and view all measurements
measurementInfoRouter.post("/addMeasurementInfo", TrainerAuth, isAdmin, addMeasurementInfo);
measurementInfoRouter.put("/updateMeasurementInfo/:id", TrainerAuth, isAdmin, updateMeasurementInfo);
measurementInfoRouter.delete("/deleteMeasurementInfo/:id", TrainerAuth, isAdmin, deleteMeasurementInfo);
measurementInfoRouter.get("/getAllMeasurementInfo", TrainerAuth, isAdmin, getAllMeasurementInfo);

// Members can only view their own measurements
measurementInfoRouter.get("/getMeasurementInfoById/:id", TrainerAuth, checkMemberAccess, getMeasurementInfoById);

export default measurementInfoRouter;
