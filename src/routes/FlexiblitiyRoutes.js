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

const flexiblitiyRouter = express.Router();

// Only trainers can add, update, delete, and view all flexibility records
flexiblitiyRouter.post("/addFlexiblitiy", TrainerAuth, isAdmin, addFlexiblitiy);
flexiblitiyRouter.put("/updateFlexiblitiy/:id", TrainerAuth, isAdmin, updateFlexiblitiy);
flexiblitiyRouter.delete("/deleteFlexiblitiy/:id", TrainerAuth, isAdmin, deleteFlexiblitiy);
flexiblitiyRouter.get("/getAllFlexiblitiy", TrainerAuth, isAdmin, getAllFlexiblitiy);

// Members can only view their own flexibility records
flexiblitiyRouter.get("/getFlexiblitiyById/:id", TrainerAuth, checkMemberAccess, getFlexiblitiyById);

export default flexiblitiyRouter;