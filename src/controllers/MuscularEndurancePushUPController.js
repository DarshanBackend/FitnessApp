import MuscularEndurancePushUPModel from '../models/MuscularEndurancePushUPModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';


// Add a new MuscularEndurancePushUP
export const addMuscularEndurancePushUP = async (req, res) => {
    try {
        const newMuscularEndurancePushUP = new MuscularEndurancePushUPModel(req.body);
        const savedMuscularEndurancePushUP = await newMuscularEndurancePushUP.save();
        return sendCreatedResponse(res, "Muscular Endurance Push UP added successfully", savedMuscularEndurancePushUP);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single MuscularEndurancePushUP by ID
export const getMuscularEndurancePushUPById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Endurance Push UP ID");
    }
    try {
        const MuscularEndurancePushUP = await MuscularEndurancePushUPModel.findById(req.params.id);
        if (!MuscularEndurancePushUP) {
            return sendNotFoundResponse(res, "Muscular Endurance Push UP not found");
        }
        return sendSuccessResponse(res, "Muscular Endurance Push UP retrieved successfully", MuscularEndurancePushUP);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all MuscularEndurancePushUPs
export const getAllMuscularEndurancePushUP = async (req, res) => {
    try {
        const MuscularEndurancePushUPs = await MuscularEndurancePushUPModel.find().sort({ createdAt: -1 });

        if (!MuscularEndurancePushUPs || MuscularEndurancePushUPs.length === 0) {
            return sendSuccessResponse(res, "No Muscular Endurance Push UP records found", []);
        }

        const formattedMuscularEndurancePushUPs = MuscularEndurancePushUPs.map((MuscularEndurancePushUP) => {
            return {
                ...MuscularEndurancePushUP._doc,
                formattedDate: dayjs(MuscularEndurancePushUP.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Muscular Endurance Push UP records retrieved successfully", formattedMuscularEndurancePushUPs);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a MuscularEndurancePushUP by ID
export const updateMuscularEndurancePushUP = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Endurance Push UP ID");
    }
    try {
        const updatedMuscularEndurancePushUP = await MuscularEndurancePushUPModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMuscularEndurancePushUP) {
            return sendNotFoundResponse(res, "Muscular Endurance Push UP not found");
        }
        return sendSuccessResponse(res, "Muscular Endurance Push UP updated successfully", updatedMuscularEndurancePushUP);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a MuscularEndurancePushUP by ID
export const deleteMuscularEndurancePushUP = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Endurance Push UP ID");
    }
    try {
        const deletedMuscularEndurancePushUP = await MuscularEndurancePushUPModel.findByIdAndDelete(req.params.id);
        if (!deletedMuscularEndurancePushUP) {
            return sendNotFoundResponse(res, "Muscular Endurance Push UP not found");
        }
        return sendSuccessResponse(res, "Muscular Endurance Push UP deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};
