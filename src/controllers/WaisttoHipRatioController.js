import WaisttoHipRatioModel from '../models/WaisttoHipRatioModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendCreatedResponse, sendNotFoundResponse, sendBadRequestResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Add a new WaisttoHipRatio
export const addWaisttoHipRatio = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add waist to hip ratio data for a member.");
            }

            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }

        const newWaisttoHipRatio = new WaisttoHipRatioModel({
            ...req.body,
            memberId: memberId
        });

        const savedWaisttoHipRatio = await newWaisttoHipRatio.save();
        return sendCreatedResponse(res, "Waist to Hip Ratio added successfully", savedWaisttoHipRatio);
    } catch (error) {
        console.error("Error adding waist to hip ratio record:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get WaisttoHipRatio by ID
export const getWaisttoHipRatioById = async (req, res) => {
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
            return sendBadRequestResponse(res, "Trainers must provide a memberId parameter to view a member's waist to hip ratio records.");
        }

        // Find all records for the member
        const waisttoHipRatios = await WaisttoHipRatioModel.find({ memberId }).sort({ createdAt: -1 });

        if (!waisttoHipRatios || waisttoHipRatios.length === 0) {
            return sendNotFoundResponse(res, "No waist to hip ratio records found for this member");
        }

        // Format records with dates
        const formattedWaisttoHipRatios = waisttoHipRatios.map((waisttoHipRatio) => {
            return {
                ...waisttoHipRatio._doc,
                formattedDate: dayjs(waisttoHipRatio.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, "Waist to Hip Ratio records retrieved successfully", formattedWaisttoHipRatios);
    } catch (error) {
        console.error('Error getting waist to hip ratio:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all WaisttoHipRatios
export const getAllWaisttoHipRatio = async (req, res) => {
    try {
        let query = {};
        let responseMessage = "All waist to hip ratios retrieved successfully";

        if (!req.trainer.isAdmin) {
            // Member: Show their specific measurements
            query = { memberId: req.trainer._id };
            responseMessage = "Your waist to hip ratios retrieved successfully";
        } else if (req.query.memberId) {
            // Trainer with memberId query: Show that member's specific measurements
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = { memberId: req.query.memberId };
            responseMessage = `Waist to hip ratios for member ${req.query.memberId} retrieved successfully`;
        }

        const waisttoHipRatios = await WaisttoHipRatioModel.find(query).sort({ createdAt: -1 });

        if (!waisttoHipRatios || waisttoHipRatios.length === 0) {
            return sendSuccessResponse(res, "No waist to hip ratios found", []);
        }

        const formattedWaisttoHipRatios = waisttoHipRatios.map((waisttoHipRatio) => {
            return {
                ...waisttoHipRatio._doc,
                formattedDate: dayjs(waisttoHipRatio.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, responseMessage, formattedWaisttoHipRatios);
    } catch (error) {
        console.error("Error retrieving all waist to hip ratio records:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update WaisttoHipRatio
export const updateWaisttoHipRatio = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Waist to Hip Ratio ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const updatedWaisttoHipRatio = await WaisttoHipRatioModel.findOneAndUpdate(
            query,
            { ...req.body },
            { new: true }
        );

        if (!updatedWaisttoHipRatio) {
            return sendNotFoundResponse(res, "Waist to Hip Ratio not found or you do not have permission to update it");
        }

        return sendSuccessResponse(res, "Waist to Hip Ratio updated successfully", updatedWaisttoHipRatio);
    } catch (error) {
        console.error('Error updating waist to hip ratio record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete WaisttoHipRatio
export const deleteWaisttoHipRatio = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Waist to Hip Ratio ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const deletedWaisttoHipRatio = await WaisttoHipRatioModel.findOneAndDelete(query);

        if (!deletedWaisttoHipRatio) {
            return sendNotFoundResponse(res, "Waist to Hip Ratio not found or you do not have permission to delete it");
        }

        return sendSuccessResponse(res, "Waist to Hip Ratio deleted successfully");
    } catch (error) {
        console.error('Error deleting waist to hip ratio record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};