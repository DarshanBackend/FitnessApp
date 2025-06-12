import MuscularEnduranceCrunchModel from '../models/MuscularEnduranceCrunchModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Add a new MuscularEnduranceCrunch
export const addMuscularEnduranceCrunch = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            // If trainer, memberId should be provided in the request body
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add muscular endurance crunch records for a member.");
            }
            // Validate if the memberId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }

    
        const newMuscularEnduranceCrunch = new MuscularEnduranceCrunchModel({
            ...req.body,
            memberId: memberId
        });
        const savedMuscularEnduranceCrunch = await newMuscularEnduranceCrunch.save();
  
        return sendCreatedResponse(res, "Muscular Endurance Crunch record added successfully", savedMuscularEnduranceCrunch);
    } catch (error) {
        console.error('Error adding muscular endurance crunch record:', error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single MuscularEnduranceCrunch by ID
export const getMuscularEnduranceCrunchById = async (req, res) => {
    try {
       
        // Use the validated member from middleware
        const muscularEnduranceCrunch = await MuscularEnduranceCrunchModel.findOne({ memberId: req.member._id });
      
        
        if (!muscularEnduranceCrunch) {
            return sendNotFoundResponse(res, "Muscular Endurance Crunch record not found");
        }

        return sendSuccessResponse(res, "Muscular Endurance Crunch record retrieved successfully", muscularEnduranceCrunch);
    } catch (error) {
        console.error('Error getting muscular endurance crunch record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all MuscularEnduranceCrunch records
export const getAllMuscularEnduranceCrunch = async (req, res) => {
    try {
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Only trainers can view all muscular endurance crunch records.");
        }
        
        const muscularEnduranceCrunches = await MuscularEnduranceCrunchModel.find().sort({ createdAt: -1 });
        
        if (!muscularEnduranceCrunches || muscularEnduranceCrunches.length === 0) {
            return sendSuccessResponse(res, "No Muscular Endurance Crunch records found", []);
        }

        const formattedMuscularEnduranceCrunches = muscularEnduranceCrunches.map((muscularEnduranceCrunch) => {
            return {
                ...muscularEnduranceCrunch._doc,
                formattedDate: dayjs(muscularEnduranceCrunch.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Muscular Endurance Crunch records retrieved successfully", formattedMuscularEnduranceCrunches);
    } catch (error) {
        console.error('Error getting all muscular endurance crunch records:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a MuscularEnduranceCrunch record
export const updateMuscularEnduranceCrunch = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid muscular endurance crunch record ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }


        const updatedMuscularEnduranceCrunch = await MuscularEnduranceCrunchModel.findOneAndUpdate(
            query,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updatedMuscularEnduranceCrunch) {
            return sendNotFoundResponse(res, "Muscular Endurance Crunch record not found or you do not have permission to update it");
        }

        return sendSuccessResponse(res, "Muscular Endurance Crunch record updated successfully", updatedMuscularEnduranceCrunch);
    } catch (error) {
        console.error('Error updating muscular endurance crunch record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete a MuscularEnduranceCrunch record
export const deleteMuscularEnduranceCrunch = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid muscular endurance crunch record ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

       
        const deletedMuscularEnduranceCrunch = await MuscularEnduranceCrunchModel.findOneAndDelete(query);

        if (!deletedMuscularEnduranceCrunch) {
            return sendNotFoundResponse(res, "Muscular Endurance Crunch record not found or you do not have permission to delete it");
        }

        return sendSuccessResponse(res, "Muscular Endurance Crunch record deleted successfully");
    } catch (error) {
        console.error('Error deleting muscular endurance crunch record:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};
