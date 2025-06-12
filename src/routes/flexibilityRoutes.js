import express from "express";
import {
    addFlexiblitiy,
    getFlexiblitiyById,
    getAllFlexiblitiy,
    updateFlexiblitiy,
    deleteFlexiblitiy,
} from "../controllers/FlexiblitiyController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";
import { checkMemberAccess } from "../middlewares/accessControl.js";

const flexibilityRouter = express.Router();

// Only trainers can add, update, delete, and view all flexibility records
flexibilityRouter.post("/addFlexiblitiy", TrainerAuth, isAdmin, addFlexiblitiy);
flexibilityRouter.put("/updateFlexiblitiy/:id", TrainerAuth, isAdmin, updateFlexiblitiy);
flexibilityRouter.delete("/deleteFlexiblitiy/:id", TrainerAuth, isAdmin, deleteFlexiblitiy);
flexibilityRouter.get("/getAllFlexiblitiy", TrainerAuth, isAdmin, getAllFlexiblitiy);

// Members can only view their own flexibility records
flexibilityRouter.get("/getFlexiblitiyById/:id", TrainerAuth, checkMemberAccess, getFlexiblitiyById);

export default flexibilityRouter; 