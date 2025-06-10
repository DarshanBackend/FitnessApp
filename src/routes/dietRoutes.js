import express from "express";
import {
    adddiet,
    getdietById,
    getAlldiet,
    updatediet,
    deletediet,
    getDietByDay,
} from "../controllers/dietController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const dietRouter = express.Router();

// Only trainers can add, update, and delete
dietRouter.post("/addDiet", TrainerAuth, isAdmin, adddiet);
dietRouter.put("/updateDiet/:id", TrainerAuth, isAdmin, updatediet);
dietRouter.delete("/deleteDiet/:id", TrainerAuth, isAdmin, deletediet);

// Both trainers and members can view
dietRouter.get("/getDietById/:id", TrainerAuth, getdietById);
dietRouter.get("/getAllDiet", TrainerAuth, getAlldiet);
dietRouter.get("/getDietByDay/:day", TrainerAuth, getDietByDay);

export default dietRouter;
