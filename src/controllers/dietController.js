import DietModel from '../models/dietModel.js';
import mongoose from 'mongoose';
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

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

        // Validate required fields
        if (!req.body.day || !req.body.breakfast || !req.body.lunch || !req.body.snack || !req.body.dinner) {
            return sendBadRequestResponse(res, "All fields (day, breakfast, lunch, snack, dinner) are required");
        }

        // Convert day to lowercase
        const dayLower = req.body.day.toLowerCase();
      

        const newdiet = new DietModel({
            ...req.body,
            day: dayLower,
            memberId: memberId
        });

        const saveddiet = await newdiet.save();
      
        return sendCreatedResponse(res, "Diet plan added successfully", saveddiet);
    } catch (error) {
        console.error('Error adding diet plan:', error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single diet by ID
export const getdietById = async (req, res) => {
    try {
       
        // Use the validated member from middleware
        const diet = await DietModel.findOne({ memberId: req.member._id });
        
        if (!diet) {
            return sendNotFoundResponse(res, "Diet plan not found");
        }

        return sendSuccessResponse(res, "Diet plan retrieved successfully", diet);
    } catch (error) {
        console.error('Error getting diet plan:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all diets
export const getAlldiet = async (req, res) => {
    try {
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Only trainers can view all diet plans.");
        }

        const diets = await DietModel.find().sort({ createdAt: -1 });

        if (!diets || diets.length === 0) {
            return sendSuccessResponse(res, "No diet plans found", []);
        }

        return sendSuccessResponse(res, "Diet plans retrieved successfully", diets);
    } catch (error) {
        console.error('Error getting all diet plans:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get diet by day
export const getDietByDay = async (req, res) => {
    try {
        const { day } = req.params;
   
        // Convert day to lowercase for case-insensitive matching
        const dayLower = day.toLowerCase();
       

        // Build query based on user type
        let query = { day: dayLower };
        if (!req.trainer.isAdmin) {
            query.memberId = req.member._id;
        }
      

        const diet = await DietModel.findOne(query);
       
        if (!diet) {
            
            return sendNotFoundResponse(res, "Diet plan not found for this day");
        }

        return sendSuccessResponse(res, "Diet plan retrieved successfully", diet);
    } catch (error) {
        console.error('Error getting diet plan by day:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a diet by ID
export const updatediet = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid diet plan ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const updateddiet = await DietModel.findOneAndUpdate(
            query,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updateddiet) {
            return sendNotFoundResponse(res, "Diet plan not found or you do not have permission to update it");
        }

        return sendSuccessResponse(res, "Diet plan updated successfully", updateddiet);
    } catch (error) {
        console.error('Error updating diet plan:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete a diet by ID
export const deletediet = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid diet plan ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

    
        const deleteddiet = await DietModel.findOneAndDelete(query);

        if (!deleteddiet) {
            return sendNotFoundResponse(res, "Diet plan not found or you do not have permission to delete it");
        }

        return sendSuccessResponse(res, "Diet plan deleted successfully");
    } catch (error) {
        console.error('Error deleting diet plan:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};
