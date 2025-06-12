import CardiovascularModel from '../models/CardiovascularModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendCreatedResponse, sendNotFoundResponse, sendBadRequestResponse } from '../utils/ResponseUtils.js';

// Add a new Cardiovascular
export const addCardiovascular = async (req, res) => {
    try {
        const newCardiovascular = new CardiovascularModel(req.body);
        const savedCardiovascular = await newCardiovascular.save();
        return sendCreatedResponse(res, "Cardiovascular record added successfully", savedCardiovascular);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single Cardiovascular by ID
export const getCardiovascularById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Cardiovascular ID");
    }
    try {
        const Cardiovascular = await CardiovascularModel.findById(req.params.id);
        if (!Cardiovascular) {
            return sendNotFoundResponse(res, "Cardiovascular not found");
        }
        return sendSuccessResponse(res, "Cardiovascular record retrieved successfully", Cardiovascular);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all Cardiovasculars
export const getAllCardiovascular = async (req, res) => {
    try {
        const Cardiovasculars = await CardiovascularModel.find().sort({ createdAt: -1 });

        if (!Cardiovasculars || Cardiovasculars.length === 0) {
            return sendSuccessResponse(res, "No Cardiovascular records found", []);
        }

        const formattedCardiovasculars = Cardiovasculars.map((Cardiovascular) => {
            return {
                ...Cardiovascular._doc,
                formattedDate: dayjs(Cardiovascular.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Cardiovascular records retrieved successfully", formattedCardiovasculars);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a Cardiovascular by ID
export const updateCardiovascular = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Cardiovascular ID");
    }
    try {
        const updatedCardiovascular = await CardiovascularModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCardiovascular) {
            return sendNotFoundResponse(res, "Cardiovascular not found");
        }
        return sendSuccessResponse(res, "Cardiovascular record updated successfully", updatedCardiovascular);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a Cardiovascular by ID
export const deleteCardiovascular = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Cardiovascular ID");
    }
    try {
        const deletedCardiovascular = await CardiovascularModel.findByIdAndDelete(req.params.id);
        if (!deletedCardiovascular) {
            return sendNotFoundResponse(res, "Cardiovascular not found");
        }
        return sendSuccessResponse(res, "Cardiovascular record deleted successfully", null);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};
