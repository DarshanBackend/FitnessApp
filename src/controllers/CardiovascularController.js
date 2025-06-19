import CardiovascularModel from '../models/CardiovascularModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendCreatedResponse, sendNotFoundResponse, sendBadRequestResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Add a new Cardiovascular
export const addCardiovascular = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add cardiovascular records for a member.");
            }

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
        let memberId;
        if (!req.trainer.isAdmin) {
            // Member: can only see their own data
            memberId = req.trainer._id;
        } else if (req.params.id) {
            // Trainer: must provide memberId in params
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return sendBadRequestResponse(res, "Invalid memberId format in params");
            }
            memberId = req.params.id;
        } else if (req.query.memberId) {
            // Trainer: can also provide memberId as query param
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            memberId = req.query.memberId;
        } else {
            // Trainer without memberId: not allowed
            return sendBadRequestResponse(res, "Trainers must provide a memberId parameter to view a member's cardiovascular records.");
        }

        // Find all records for the member
        const cardiovasculars = await CardiovascularModel.find({ memberId }).sort({ createdAt: -1 });
    
        if (!cardiovasculars || cardiovasculars.length === 0) {
            return sendNotFoundResponse(res, "No cardiovascular records found for this member");
        }

        // Format records with dates
        const formattedCardiovasculars = cardiovasculars.map((cardiovascular) => {
            return {
                ...cardiovascular._doc,
                formattedDate: dayjs(cardiovascular.createdAt).format("DD MMM YYYY")
            };
        });

        // Group records by date
        const cardioByDay = formattedCardiovasculars.reduce((acc, cardio) => {
            const day = cardio.formattedDate;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(cardio);
            return acc;
        }, {});

        return sendSuccessResponse(res, "Cardiovascular records retrieved successfully", cardioByDay);
    } catch (error) {
        console.error('Error getting cardiovascular record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all Cardiovasculars
export const getAllCardiovascular = async (req, res) => {
    try {
        let query = {};
        let responseMessage = "All cardiovascular records retrieved successfully";

        if (!req.trainer.isAdmin) {
            // Member: Show their specific measurements
            query = { memberId: req.trainer._id };
            responseMessage = "Your cardiovascular records retrieved successfully";
        } else if (req.query.memberId) {
            // Trainer with memberId query: Show that member's specific measurements
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = { memberId: req.query.memberId };
            responseMessage = `Cardiovascular records for member ${req.query.memberId} retrieved successfully`;
        }

        const cardiovasculars = await CardiovascularModel.find(query).sort({ createdAt: -1 });

        if (!cardiovasculars || cardiovasculars.length === 0) {
            return sendSuccessResponse(res, "No cardiovascular records found", []);
        }

        const formattedCardiovasculars = cardiovasculars.map((cardiovascular) => {
            return {
                ...cardiovascular._doc,
                formattedDate: dayjs(cardiovascular.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, responseMessage, formattedCardiovasculars);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update Cardiovascular
export const updateCardiovascular = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Cardiovascular ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const updatedCardiovascular = await CardiovascularModel.findOneAndUpdate(
            query,
            { ...req.body },
            { new: true }
        );

        if (!updatedCardiovascular) {
            return sendNotFoundResponse(res, "Cardiovascular not found or you do not have permission to update it");
        }

        return sendSuccessResponse(res, "Cardiovascular record updated successfully", updatedCardiovascular);
    } catch (error) {
        console.error('Error updating cardiovascular record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete Cardiovascular
export const deleteCardiovascular = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Cardiovascular ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const deletedCardiovascular = await CardiovascularModel.findOneAndDelete(query);

        if (!deletedCardiovascular) {
            return sendNotFoundResponse(res, "Cardiovascular not found or you do not have permission to delete it");
        }

        return sendSuccessResponse(res, "Cardiovascular record deleted successfully");
    } catch (error) {
        console.error('Error deleting cardiovascular record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};
