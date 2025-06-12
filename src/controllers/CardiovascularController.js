import CardiovascularModel from '../models/CardiovascularModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendCreatedResponse, sendNotFoundResponse, sendBadRequestResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Add a new Cardiovascular
export const addCardiovascular = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            // If trainer, memberId should be provided in the request body
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add cardiovascular records for a member.");
            }
            // Validate if the memberId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }

        const newCardiovascular = new CardiovascularModel({
            ...req.body,
            memberId: memberId
        });
        const savedCardiovascular = await newCardiovascular.save();
        return sendCreatedResponse(res, "Cardiovascular record added successfully", savedCardiovascular);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single Cardiovascular by ID
export const getCardiovascularById = async (req, res) => {
    try {
        const { id } = req.params;
     
        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const cardiovascular = await CardiovascularModel.findOne(query);
      
        if (!cardiovascular) {
            return sendNotFoundResponse(res, "Cardiovascular record not found");
        }

        return sendSuccessResponse(res, "Cardiovascular record retrieved successfully", cardiovascular);
    } catch (error) {
        console.error('Error getting cardiovascular record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all Cardiovasculars
export const getAllCardiovascular = async (req, res) => {
    try {
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Only trainers can view all cardiovascular records.");
        }

        const cardiovasculars = await CardiovascularModel.find().sort({ createdAt: -1 });

        if (!cardiovasculars || cardiovasculars.length === 0) {
            return sendSuccessResponse(res, "No Cardiovascular records found", []);
        }

        const formattedCardiovasculars = cardiovasculars.map((cardiovascular) => {
            return {
                ...cardiovascular._doc,
                formattedDate: dayjs(cardiovascular.createdAt).format("DD MMM YYYY"),
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
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const updatedCardiovascular = await CardiovascularModel.findOneAndUpdate(
            query,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCardiovascular) {
            return sendNotFoundResponse(res, "Cardiovascular not found or you do not have permission to update it.");
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
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const deletedCardiovascular = await CardiovascularModel.findOneAndDelete(query);
        if (!deletedCardiovascular) {
            return sendNotFoundResponse(res, "Cardiovascular not found or you do not have permission to delete it.");
        }
        return sendSuccessResponse(res, "Cardiovascular record deleted successfully", null);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};
