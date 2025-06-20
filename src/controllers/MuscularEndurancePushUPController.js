import MuscularEndurancePushUPModel from '../models/MuscularEndurancePushUPModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';


// Add a new MuscularEndurancePushUP
export const addMuscularEndurancePushUP = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add muscular endurance push-up data for a member.");
            }

            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }
   console.log(`Adding muscular endurance push-up record for member: ${memberId}`);

        const newMuscularEndurancePushUP = new MuscularEndurancePushUPModel({
            ...req.body,
            memberId: memberId
        });
        const savedMuscularEndurancePushUP = await newMuscularEndurancePushUP.save();
        return sendCreatedResponse(res, "Muscular Endurance Push UP added successfully", savedMuscularEndurancePushUP);
    } catch (error) {
        console.error("Error adding muscular endurance push-up record:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single MuscularEndurancePushUP by ID
export const getMuscularEndurancePushUPById = async (req, res) => {
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
            return sendBadRequestResponse(res, "Trainers must provide a memberId parameter to view a member's muscular endurance push-up records.");
        }

        // Find all records for the member
        const muscularEndurancePushUPs = await MuscularEndurancePushUPModel.find({ memberId }).sort({ createdAt: -1 });
    
        if (!muscularEndurancePushUPs || muscularEndurancePushUPs.length === 0) {
            return sendNotFoundResponse(res, "No muscular endurance push-up records found for this member");
        }

        // Format records with dates
        const formattedMuscularEndurancePushUPs = muscularEndurancePushUPs.map((muscularEndurancePushUP) => {
            return {
                ...muscularEndurancePushUP._doc,
                formattedDate: dayjs(muscularEndurancePushUP.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, "Muscular endurance push-up records retrieved successfully", formattedMuscularEndurancePushUPs);
    } catch (error) {
        console.error('Error getting muscular endurance push-up record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all MuscularEndurancePushUPs
export const getAllMuscularEndurancePushUP = async (req, res) => {
    try {
        let query = {};
        let responseMessage = "All muscular endurance push-up records retrieved successfully";

        if (!req.trainer.isAdmin) {
            // Member: Show their specific measurements
            query = { memberId: req.trainer._id };
            responseMessage = "Your muscular endurance push-up records retrieved successfully";
        } else if (req.query.memberId) {
            // Trainer with memberId query: Show that member's specific measurements
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = { memberId: req.query.memberId };
            responseMessage = `Muscular endurance push-up records for member ${req.query.memberId} retrieved successfully`;
        }
        
        const muscularEndurancePushUPs = await MuscularEndurancePushUPModel.find(query).sort({ createdAt: -1 });
        
        if (!muscularEndurancePushUPs || muscularEndurancePushUPs.length === 0) {
            return sendSuccessResponse(res, "No muscular endurance push-up records found", []);
        }

        const formattedMuscularEndurancePushUPs = muscularEndurancePushUPs.map((muscularEndurancePushUP) => {
            return {
                ...muscularEndurancePushUP._doc,
                formattedDate: dayjs(muscularEndurancePushUP.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, responseMessage, formattedMuscularEndurancePushUPs);
    } catch (error) {
        console.error('Error getting all muscular endurance push-up records:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a MuscularEndurancePushUP by ID
export const updateMuscularEndurancePushUP = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid muscular endurance push-up record ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

    
        const updatedMuscularEndurancePushUP = await MuscularEndurancePushUPModel.findOneAndUpdate(
            query,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updatedMuscularEndurancePushUP) {
            return sendNotFoundResponse(res, "Muscular Endurance Push UP record not found or you do not have permission to update it");
        }

        return sendSuccessResponse(res, "Muscular Endurance Push UP record updated successfully", updatedMuscularEndurancePushUP);
    } catch (error) {
        console.error('Error updating muscular endurance push-up record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete a MuscularEndurancePushUP by ID
export const deleteMuscularEndurancePushUP = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Muscular Endurance Push UP ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

      

        const deletedMuscularEndurancePushUP = await MuscularEndurancePushUPModel.findOneAndDelete(query);
        if (!deletedMuscularEndurancePushUP) {
            return sendNotFoundResponse(res, "Muscular Endurance Push UP not found or you do not have permission to delete it.");
        }
        return sendSuccessResponse(res, "Muscular Endurance Push UP deleted successfully");
    } catch (error) {
        console.error("Error deleting muscular endurance push-up record:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};
