import MuscularEnduranceCrunchModel from '../models/MuscularEnduranceCrunchModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';

// Add a new MuscularEnduranceCrunch
export const addMuscularEnduranceCrunch = async (req, res) => {
    try {
        const newMuscularEnduranceCrunch = new MuscularEnduranceCrunchModel(req.body);
        const savedMuscularEnduranceCrunch = await newMuscularEnduranceCrunch.save();
        return sendCreatedResponse(res, "Muscular Endurance Crunch added successfully", savedMuscularEnduranceCrunch);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single MuscularEnduranceCrunch by ID
export const getMuscularEnduranceCrunchById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Endurance Crunch ID");
    }
    try {
        const MuscularEnduranceCrunch = await MuscularEnduranceCrunchModel.findById(req.params.id);
        if (!MuscularEnduranceCrunch) {
            return sendNotFoundResponse(res, "Muscular Endurance Crunch not found");
        }
        return sendSuccessResponse(res, "Muscular Endurance Crunch retrieved successfully", MuscularEnduranceCrunch);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all MuscularEnduranceCrunchs
export const getAllMuscularEnduranceCrunch = async (req, res) => {
    try {
        const MuscularEnduranceCrunchs = await MuscularEnduranceCrunchModel.find().sort({ createdAt: -1 });

        if (!MuscularEnduranceCrunchs || MuscularEnduranceCrunchs.length === 0) {
            return sendSuccessResponse(res, "No Muscular Endurance Crunch records found", []);
        }

        const formattedMuscularEnduranceCrunchs = MuscularEnduranceCrunchs.map((MuscularEnduranceCrunch) => {
            return {
                ...MuscularEnduranceCrunch._doc,
                formattedDate: dayjs(MuscularEnduranceCrunch.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Muscular Endurance Crunch records retrieved successfully", formattedMuscularEnduranceCrunchs);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a MuscularEnduranceCrunch by ID
export const updateMuscularEnduranceCrunch = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Endurance Crunch ID");
    }
    try {
        const updatedMuscularEnduranceCrunch = await MuscularEnduranceCrunchModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMuscularEnduranceCrunch) {
            return sendNotFoundResponse(res, "Muscular Endurance Crunch not found");
        }
        return sendSuccessResponse(res, "Muscular Endurance Crunch updated successfully", updatedMuscularEnduranceCrunch);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a MuscularEnduranceCrunch by ID
export const deleteMuscularEnduranceCrunch = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Endurance Crunch ID");
    }
    try {
        const deletedMuscularEnduranceCrunch = await MuscularEnduranceCrunchModel.findByIdAndDelete(req.params.id);
        if (!deletedMuscularEnduranceCrunch) {
            return sendNotFoundResponse(res, "Muscular Endurance Crunch not found");
        }
        return sendSuccessResponse(res, "Muscular Endurance Crunch deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};
