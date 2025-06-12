import FlexiblitiyModel from '../models/FlexiblitiyModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Add a new Flexibility
export const addFlexiblitiy = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add flexibility records for a member.");
            }

            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }

        // Check if flexibility record already exists for this member
        const existingFlexibility = await FlexiblitiyModel.findOne({ memberId });
        if (existingFlexibility) {
            return sendBadRequestResponse(res, "Flexibility record already exists for this member. Please update instead of creating new.");
        }

       

        const newFlexiblitiy = new FlexiblitiyModel({
            ...req.body,
            memberId: memberId
        });
        const savedFlexiblitiy = await newFlexiblitiy.save();
       
        return sendCreatedResponse(res, "Flexibility record added successfully", savedFlexiblitiy);
    } catch (error) {
        console.error('Error adding flexibility record:', error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single Flexibility by ID
export const getFlexiblitiyById = async (req, res) => {
    try {
     
        // Use the validated member from middleware
        const flexibility = await FlexiblitiyModel.findOne({ memberId: req.member._id });
       
        
        if (!flexibility) {
            return sendNotFoundResponse(res, "Flexibility record not found");
        }

        return sendSuccessResponse(res, "Flexibility record retrieved successfully", flexibility);
    } catch (error) {
        console.error('Error getting flexibility record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all Flexibility records
export const getAllFlexiblitiy = async (req, res) => {
    try {
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Only trainers can view all flexibility records.");
        }
        
        const flexibilities = await FlexiblitiyModel.find();
        
        if (!flexibilities || flexibilities.length === 0) {
            return sendSuccessResponse(res, "No flexibility records found", []);
        }

        return sendSuccessResponse(res, "Flexibility records fetched successfully", flexibilities);
    } catch (error) {
        console.error('Error getting all flexibility records:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a Flexibility record
export const updateFlexiblitiy = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid flexibility record ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

     

        const updatedFlexiblitiy = await FlexiblitiyModel.findOneAndUpdate(
            query,
            { ...req.body },
            { new: true }
        );

        if (!updatedFlexiblitiy) {
            return sendNotFoundResponse(res, "Flexibility record not found or you do not have permission to update it");
        }

        return sendSuccessResponse(res, "Flexibility record updated successfully", updatedFlexiblitiy);
    } catch (error) {
        console.error('Error updating flexibility record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete a Flexibility record
export const deleteFlexiblitiy = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid flexibility record ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const deletedFlexiblitiy = await FlexiblitiyModel.findOneAndDelete(query);

        if (!deletedFlexiblitiy) {
            return sendNotFoundResponse(res, "Flexibility record not found or you do not have permission to delete it");
        }

        return sendSuccessResponse(res, "Flexibility record deleted successfully");
    } catch (error) {
        console.error('Error deleting flexibility record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};