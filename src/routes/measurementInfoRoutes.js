import express from "express";
import {
    addMeasurementInfo,
    getMeasurementInfoById,
    getAllMeasurementInfo,
    updateMeasurementInfo,
    deleteMeasurementInfo,
} from "../controllers/measurementInfoController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const measurementInfoRouter = express.Router();

// Only trainers can add, update, and delete
measurementInfoRouter.post("/addMeasurementInfo", TrainerAuth, isAdmin, addMeasurementInfo);
measurementInfoRouter.put("/updateMeasurementInfo/:id", TrainerAuth, isAdmin, updateMeasurementInfo);
measurementInfoRouter.delete("/deleteMeasurementInfo/:id", TrainerAuth, isAdmin, deleteMeasurementInfo);
measurementInfoRouter.get("/getMeasurementInfoById/:id", TrainerAuth, getMeasurementInfoById);

// Both trainers and members can view
measurementInfoRouter.get("/getAllMeasurementInfo", TrainerAuth, getAllMeasurementInfo);


export default measurementInfoRouter;
