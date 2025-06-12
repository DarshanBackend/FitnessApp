import express from "express";
import {
    addvo2MaxRockPortTest,
    getvo2MaxRockPortTestById,
    getAllvo2MaxRockPortTest,
    updatevo2MaxRockPortTest,
    deletevo2MaxRockPortTest,
} from "../controllers/Vo2MaxRockPortTestController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";
import { checkMemberAccess } from "../middlewares/accessControl.js";

const vo2MaxRockPortTestRouter = express.Router();

// Only trainers can add, update, delete, and view all VO2 Max Rock Port Test records
vo2MaxRockPortTestRouter.post("/addVo2MaxRockPortTest", TrainerAuth, isAdmin, addvo2MaxRockPortTest);
vo2MaxRockPortTestRouter.put("/updateVo2MaxRockPortTest/:id", TrainerAuth, isAdmin, updatevo2MaxRockPortTest);
vo2MaxRockPortTestRouter.delete("/deleteVo2MaxRockPortTest/:id", TrainerAuth, isAdmin, deletevo2MaxRockPortTest);
vo2MaxRockPortTestRouter.get("/getAllVo2MaxRockPortTest", TrainerAuth, isAdmin, getAllvo2MaxRockPortTest);

// Members can only view their own VO2 Max Rock Port Test records
vo2MaxRockPortTestRouter.get("/getVo2MaxRockPortTestById/:id", TrainerAuth, checkMemberAccess, getvo2MaxRockPortTestById);

export default vo2MaxRockPortTestRouter;
