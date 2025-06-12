import DietModel from '../models/dietModel.js';
import mongoose from 'mongoose';
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';

// Add a new diet
export const adddiet = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            // If trainer, memberId should be provided in the request body
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add diet plans for a member.");
            }
            // Validate if the memberId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }

        const newdiet = new DietModel({
            ...req.body,
            memberId: memberId
        });

        console.log('Creating new diet with data:', {
            day: newdiet.day,
            memberId: newdiet.memberId,
            breakfast: newdiet.breakfast,
            lunch: newdiet.lunch,
            snack: newdiet.snack,
            dinner: newdiet.dinner
        });

        const saveddiet = await newdiet.save();
        return sendCreatedResponse(res, "Diet plan added successfully", saveddiet);
    } catch (error) {
        console.error('Error in adddiet:', error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single diet by ID
export const getdietById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid diet ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const diet = await DietModel.findOne(query);
        if (!diet) {
            return sendNotFoundResponse(res, "Diet not found or you do not have permission to view it.");
        }
        return sendSuccessResponse(res, "Diet plan retrieved successfully", diet);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all diets
export const getAlldiet = async (req, res) => {
    try {
        let query = {};
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
            console.log('Member query:', { memberId: req.trainer._id });
        }
        const diets = await DietModel.find(query);
        console.log('Found diets:', diets);

        if (!diets || diets.length === 0) {
            return sendSuccessResponse(res, "No diet plans found", []);
        }

        return sendSuccessResponse(res, "Diet plans retrieved successfully", diets);
    } catch (error) {
        console.error('Error in getAlldiet:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get diet by day
export const getDietByDay = async (req, res) => {
    try {
        let query = { day: req.params.day };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const diet = await DietModel.findOne(query);
        if (!diet) {
            return sendNotFoundResponse(res, "Diet plan not found for this day or you do not have permission to view it.");
        }
        return sendSuccessResponse(res, "Diet plan retrieved successfully", diet);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a diet by ID
export const updatediet = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid diet ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const updateddiet = await DietModel.findOneAndUpdate(
            query,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updateddiet) {
            return sendNotFoundResponse(res, "Diet not found or you do not have permission to update it.");
        }
        return sendSuccessResponse(res, "Diet plan updated successfully", updateddiet);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a diet by ID
export const deletediet = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid diet ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const deleteddiet = await DietModel.findOneAndDelete(query);
        if (!deleteddiet) {
            return sendNotFoundResponse(res, "Diet not found or you do not have permission to delete it.");
        }
        return sendSuccessResponse(res, "Diet plan deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};
