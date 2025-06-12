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
     
        // Use the validated member from middleware
        const muscularStrength = await MuscularStrengthModel.findOne({ memberId: req.member._id });
      
        if (!muscularStrength) {
            return sendNotFoundResponse(res, "Muscular Strength not found");
        }

        return sendSuccessResponse(res, "Muscular Strength retrieved successfully", muscularStrength);
    } catch (error) {
        console.error('Error getting muscular strength record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all muscularStrengths
export const getAllmuscularStrength = async (req, res) => {
    try {
        let query = {};
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

      

        const muscularStrengths = await MuscularStrengthModel.find(query).sort({ createdAt: -1 });

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
        console.error("Error retrieving all muscular strength records:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a muscularStrength by ID
export const updatemuscularStrength = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Strength ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

       

        const updatedmuscularStrength = await MuscularStrengthModel.findOneAndUpdate(
            query,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedmuscularStrength) {
            return sendNotFoundResponse(res, "Muscular Strength not found or you do not have permission to update it.");
        }
        return sendSuccessResponse(res, "Muscular Strength updated successfully", updatedmuscularStrength);
    } catch (error) {
        console.error("Error updating muscular strength record:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a muscularStrength by ID
export const deletemuscularStrength = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Strength ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

      
        const deletedmuscularStrength = await MuscularStrengthModel.findOneAndDelete(query);
        if (!deletedmuscularStrength) {
            return sendNotFoundResponse(res, "Muscular Strength not found or you do not have permission to delete it.");
        }
        return sendSuccessResponse(res, "Muscular Strength deleted successfully");
    } catch (error) {
        console.error("Error deleting muscular strength record:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};
