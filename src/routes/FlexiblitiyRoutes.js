import express from "express";
import {
    addFlexiblitiy,
    getFlexiblitiyById,
    getAllFlexiblitiy,
    updateFlexiblitiy,
    deleteFlexiblitiy,
} from "../controllers/FlexiblitiyController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const flexiblitiyRouter = express.Router();

// Only trainers can add, update, and delete
flexiblitiyRouter.post("/addFlexiblitiy", TrainerAuth, isAdmin, addFlexiblitiy);
flexiblitiyRouter.put("/updateFlexiblitiy/:id", TrainerAuth, isAdmin, updateFlexiblitiy);
flexiblitiyRouter.delete("/deleteFlexiblitiy/:id", TrainerAuth, isAdmin, deleteFlexiblitiy);

// Both trainers and members can view
flexiblitiyRouter.get("/getFlexiblitiyById/:id", TrainerAuth, getFlexiblitiyById);
flexiblitiyRouter.get("/getAllFlexiblitiy", TrainerAuth, getAllFlexiblitiy);

export default flexiblitiyRouter;