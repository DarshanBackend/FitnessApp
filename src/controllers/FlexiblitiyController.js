import FlexiblitiyModel from '../models/FlexiblitiyModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';

// Add a new Flexiblitiy
export const addFlexiblitiy = async (req, res) => {
    try {
        const newFlexiblitiy = new FlexiblitiyModel(req.body);
        const savedFlexiblitiy = await newFlexiblitiy.save();
        return sendCreatedResponse(res, "Flexibility record added successfully", savedFlexiblitiy);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single Flexiblitiy by ID
export const getFlexiblitiyById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Flexibility ID");
    }
    try {
        const Flexiblitiy = await FlexiblitiyModel.findById(req.params.id);
        if (!Flexiblitiy) {
            return sendNotFoundResponse(res, "Flexibility not found");
        }
        return sendSuccessResponse(res, "Flexibility retrieved successfully", Flexiblitiy);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all Flexiblitiys
export const getAllFlexiblitiy = async (req, res) => {
    try {
        const Flexiblitiys = await FlexiblitiyModel.find().sort({ createdAt: -1 });

        if (!Flexiblitiys || Flexiblitiys.length === 0) {
            return sendSuccessResponse(res, "No Flexibility records found", []);
        }

        const formattedFlexiblitiys = Flexiblitiys.map((Flexiblitiy) => {
            return {
                ...Flexiblitiy._doc,
                formattedDate: dayjs(Flexiblitiy.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Flexibility records retrieved successfully", formattedFlexiblitiys);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a Flexiblitiy by ID
export const updateFlexiblitiy = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Flexibility ID");
    }
    try {
        const updatedFlexiblitiy = await FlexiblitiyModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFlexiblitiy) {
            return sendNotFoundResponse(res, "Flexibility not found");
        }
        return sendSuccessResponse(res, "Flexibility updated successfully", updatedFlexiblitiy);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a Flexiblitiy by ID
export const deleteFlexiblitiy = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Flexibility ID");
    }
    try {
        const deletedFlexiblitiy = await FlexiblitiyModel.findByIdAndDelete(req.params.id);
        if (!deletedFlexiblitiy) {
            return sendNotFoundResponse(res, "Flexibility not found");
        }
        return sendSuccessResponse(res, "Flexibility deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};