import express from "express";
import {
    addLeave,
    getLeaveById,
    getAllLeave,
    updateLeave,
    deleteLeave,
    updateLeaveStatus
} from "../controllers/leaveController.js";
import { TrainerAuth, isAdmin } from "../middlewares/auth.js";

const leaveRouter = express.Router();

// Member can add leave requests
leaveRouter.post("/addLeave", TrainerAuth, addLeave);
leaveRouter.get("/getLeaveById/:id", TrainerAuth, getLeaveById);
leaveRouter.get("/getAllLeave", TrainerAuth, getAllLeave);

// Member can update and delete their own pending leave requests
leaveRouter.put("/updateLeave/:id", TrainerAuth, updateLeave);
leaveRouter.delete("/deleteLeave/:id", TrainerAuth, deleteLeave);

// Trainer can update leave status
leaveRouter.put("/updateLeaveStatus/:id", TrainerAuth, isAdmin, updateLeaveStatus);

export default leaveRouter; 