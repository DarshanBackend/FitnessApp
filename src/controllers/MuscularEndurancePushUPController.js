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
        const { id } = req.params;
     
        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const muscularEndurancePushUP = await MuscularEndurancePushUPModel.findOne(query);
      
        
        if (!muscularEndurancePushUP) {
            return sendNotFoundResponse(res, "Muscular Endurance Push UP record not found");
        }

        return sendSuccessResponse(res, "Muscular Endurance Push UP record retrieved successfully", muscularEndurancePushUP);
    } catch (error) {
        console.error('Error getting muscular endurance push-up record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all MuscularEndurancePushUPs
export const getAllMuscularEndurancePushUP = async (req, res) => {
    try {
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Only trainers can view all muscular endurance push-up records.");
        }
        
        const muscularEndurancePushUPs = await MuscularEndurancePushUPModel.find().sort({ createdAt: -1 });
        
        if (!muscularEndurancePushUPs || muscularEndurancePushUPs.length === 0) {
            return sendSuccessResponse(res, "No Muscular Endurance Push UP records found", []);
        }

        const formattedMuscularEndurancePushUPs = muscularEndurancePushUPs.map((muscularEndurancePushUP) => {
            return {
                ...muscularEndurancePushUP._doc,
                formattedDate: dayjs(muscularEndurancePushUP.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Muscular Endurance Push UP records retrieved successfully", formattedMuscularEndurancePushUPs);
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
