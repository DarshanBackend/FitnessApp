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
        const flexibilities = await FlexiblitiyModel.find({ memberId: req.member._id }).sort({ createdAt: -1 });
       
        if (!flexibilities || flexibilities.length === 0) {
            return sendNotFoundResponse(res, "No flexibility records found for this member");
        }

        // Format measurements with dates
        const formattedFlexibilities = flexibilities.map((flexibility) => {
            return {
                ...flexibility._doc,
                formattedDate: dayjs(flexibility.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, "Flexibility records retrieved successfully", formattedFlexibilities);
    } catch (error) {
        console.error('Error getting flexibility record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all Flexibility records
export const getAllFlexiblitiy = async (req, res) => {
    try {
        let query = {};
        let responseMessage = "All flexibility records retrieved successfully";

        if (!req.trainer.isAdmin) {
            // Member: Show their specific measurements
            query = { memberId: req.trainer._id };
            responseMessage = "Your flexibility records retrieved successfully";
        } else if (req.query.memberId) {
            // Trainer with memberId query: Show that member's specific measurements
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = { memberId: req.query.memberId };
            responseMessage = `Flexibility records for member ${req.query.memberId} retrieved successfully`;
        }
        
        const flexibilities = await FlexiblitiyModel.find(query).sort({ createdAt: -1 });
        
        if (!flexibilities || flexibilities.length === 0) {
            return sendSuccessResponse(res, "No flexibility records found", []);
        }

        const formattedFlexibilities = flexibilities.map((flexibility) => {
            return {
                ...flexibility._doc,
                formattedDate: dayjs(flexibility.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, responseMessage, formattedFlexibilities);
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