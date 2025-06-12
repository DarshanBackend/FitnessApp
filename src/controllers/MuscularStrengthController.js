import MuscularStrengthModel from '../models/MuscularStrengthModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';


// Add a new muscularStrength
export const addmuscularStrength = async (req, res) => {
    try {
        const newmuscularStrength = new MuscularStrengthModel(req.body);
        const savedmuscularStrength = await newmuscularStrength.save();
        return sendCreatedResponse(res, "Muscular Strength record added successfully", savedmuscularStrength);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single muscularStrength by ID
export const getmuscularStrengthById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Strength ID");
    }
    try {
        const muscularStrength = await MuscularStrengthModel.findById(req.params.id);
        if (!muscularStrength) {
            return sendNotFoundResponse(res, "Muscular Strength not found");
        }
        return sendSuccessResponse(res, "Muscular Strength retrieved successfully", muscularStrength);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all muscularStrengths
export const getAllmuscularStrength = async (req, res) => {
    try {
        const muscularStrengths = await MuscularStrengthModel.find().sort({ createdAt: -1 });

        if (!muscularStrengths || muscularStrengths.length === 0) {
            return sendSuccessResponse(res, "No Muscular Strength records found", []);
        }

        const formattedmuscularStrengths = muscularStrengths.map((muscularStrength) => {
            return {
                ...muscularStrength._doc,
                formattedDate: dayjs(muscularStrength.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Muscular Strength records retrieved successfully", formattedmuscularStrengths);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a muscularStrength by ID
export const updatemuscularStrength = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Strength ID");
    }
    try {
        const updatedmuscularStrength = await MuscularStrengthModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedmuscularStrength) {
            return sendNotFoundResponse(res, "Muscular Strength not found");
        }
        return sendSuccessResponse(res, "Muscular Strength updated successfully", updatedmuscularStrength);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a muscularStrength by ID
export const deletemuscularStrength = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Strength ID");
    }
    try {
        const deletedmuscularStrength = await MuscularStrengthModel.findByIdAndDelete(req.params.id);
        if (!deletedmuscularStrength) {
            return sendNotFoundResponse(res, "Muscular Strength not found");
        }
        return sendSuccessResponse(res, "Muscular Strength deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};
