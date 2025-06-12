import express from "express";
import {
    adddiet,
    getdietById,
    getAlldiet,
    getDietByDay,
    updatediet,
    deletediet,
} from "../controllers/dietController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";
import { checkMemberAccess } from "../middlewares/accessControl.js";

const dietRouter = express.Router();

// Only trainers can add, update, delete, and view all diet plans
dietRouter.post("/adddiet", TrainerAuth, isAdmin, adddiet);
dietRouter.put("/updatediet/:id", TrainerAuth, isAdmin, updatediet);
dietRouter.delete("/deletediet/:id", TrainerAuth, isAdmin, deletediet);
dietRouter.get("/getAlldiet", TrainerAuth, isAdmin, getAlldiet);

// Members can only view their own diet plans
dietRouter.get("/getdietById/:id", TrainerAuth, checkMemberAccess, getdietById);
dietRouter.get("/getDietByDay/:day", TrainerAuth, checkMemberAccess, getDietByDay);

export default dietRouter;
