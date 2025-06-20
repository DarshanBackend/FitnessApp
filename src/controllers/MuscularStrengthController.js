import MuscularStrengthModel from '../models/MuscularStrengthModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';


// Add a new muscularStrength
export const addmuscularStrength = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add muscular strength data for a member.");
            }

            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }


        const newmuscularStrength = new MuscularStrengthModel({
            ...req.body,
            memberId: memberId
        });
        const savedmuscularStrength = await newmuscularStrength.save();
        return sendCreatedResponse(res, "Muscular Strength record added successfully", savedmuscularStrength);
    } catch (error) {
        console.error("Error adding muscular strength record:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single muscularStrength by ID
export const getmuscularStrengthById = async (req, res) => {
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
            return sendBadRequestResponse(res, "Trainers must provide a memberId parameter to view a member's muscular strength records.");
        }

        // Find all records for the member
        const muscularStrengths = await MuscularStrengthModel.find({ memberId }).sort({ createdAt: -1 });
    
        if (!muscularStrengths || muscularStrengths.length === 0) {
            return sendNotFoundResponse(res, "No muscular strength records found for this member");
        }

        // Format records with dates
        const formattedMuscularStrengths = muscularStrengths.map((muscularStrength) => {
            return {
                ...muscularStrength._doc,
                formattedDate: dayjs(muscularStrength.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, "Muscular strength records retrieved successfully", formattedMuscularStrengths);
    } catch (error) {
        console.error('Error getting muscular strength record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all muscularStrengths
export const getAllmuscularStrength = async (req, res) => {
    try {
        let query = {};
        let responseMessage = "All muscular strength records retrieved successfully";

        if (!req.trainer.isAdmin) {
            // Member: Show their specific measurements
            query = { memberId: req.trainer._id };
            responseMessage = "Your muscular strength records retrieved successfully";
        } else if (req.query.memberId) {
            // Trainer with memberId query: Show that member's specific measurements
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = { memberId: req.query.memberId };
            responseMessage = `Muscular strength records for member ${req.query.memberId} retrieved successfully`;
        }

        const muscularStrengths = await MuscularStrengthModel.find(query).sort({ createdAt: -1 });

        if (!muscularStrengths || muscularStrengths.length === 0) {
            return sendSuccessResponse(res, "No muscular strength records found", []);
        }

        const formattedMuscularStrengths = muscularStrengths.map((muscularStrength) => {
            return {
                ...muscularStrength._doc,
                formattedDate: dayjs(muscularStrength.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, responseMessage, formattedMuscularStrengths);
    } catch (error) {
        console.error("Error retrieving all muscular strength records:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update muscularStrength
export const updatemuscularStrength = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Muscular Strength ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const updatedmuscularStrength = await MuscularStrengthModel.findOneAndUpdate(
            query,
            { ...req.body },
            { new: true }
        );

        if (!updatedmuscularStrength) {
            return sendNotFoundResponse(res, "Muscular Strength not found or you do not have permission to update it");
        }

        return sendSuccessResponse(res, "Muscular Strength updated successfully", updatedmuscularStrength);
    } catch (error) {
        console.error('Error updating muscular strength record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete muscularStrength
export const deletemuscularStrength = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Muscular Strength ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const deletedmuscularStrength = await MuscularStrengthModel.findOneAndDelete(query);

        if (!deletedmuscularStrength) {
            return sendNotFoundResponse(res, "Muscular Strength not found or you do not have permission to delete it");
        }

        return sendSuccessResponse(res, "Muscular Strength deleted successfully");
    } catch (error) {
        console.error('Error deleting muscular strength record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};
