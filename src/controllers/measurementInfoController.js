import MeasurementInfoModel from "../models/measurementInfoModel.js";
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Add a new measurement info
export const addMeasurementInfo = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add measurement info for a member.");
            }

            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }

        // Check if measurement info already exists for this member
        const existingMeasurement = await MeasurementInfoModel.findOne({ memberId });
        if (existingMeasurement) {
            return sendBadRequestResponse(res, "Measurement info already exists for this member. Please update instead of creating new.");
        }

       

        const newMeasurementInfo = new MeasurementInfoModel({
            ...req.body,
            memberId: memberId
        });
        const savedMeasurementInfo = await newMeasurementInfo.save();
       
        return sendCreatedResponse(res, "Measurement info added successfully", savedMeasurementInfo);
    } catch (error) {
        console.error('Error adding measurement info:', error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get measurement info by ID
export const getMeasurementInfoById = async (req, res) => {
    try {
       
        // Use the validated member from middleware
        const measurementInfo = await MeasurementInfoModel.findOne({ memberId: req.member._id });
     
        if (!measurementInfo) {
            return sendNotFoundResponse(res, "Measurement info not found");
        }

        return sendSuccessResponse(res, "Measurement info retrieved successfully", measurementInfo);
    } catch (error) {
        console.error('Error getting measurement info:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all measurement info
export const getAllMeasurementInfo = async (req, res) => {
    try {
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Only trainers can view all measurements.");
        }
        
        const measurementInfos = await MeasurementInfoModel.find();
        
        if (!measurementInfos || measurementInfos.length === 0) {
            return sendSuccessResponse(res, "No measurement info found", []);
        }

        return sendSuccessResponse(res, "Measurement info fetched successfully", measurementInfos);
    } catch (error) {
        console.error('Error getting all measurement info:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update measurement info
export const updateMeasurementInfo = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid measurement info ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }


        const updatedMeasurementInfo = await MeasurementInfoModel.findOneAndUpdate(
            query,
            { ...req.body },
            { new: true }
        );

        if (!updatedMeasurementInfo) {
            return sendNotFoundResponse(res, "Measurement info not found or you do not have permission to update it");
        }

        return sendSuccessResponse(res, "Measurement info updated successfully", updatedMeasurementInfo);
    } catch (error) {
        console.error('Error updating measurement info:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete measurement info
export const deleteMeasurementInfo = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid measurement info ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

       
        const deletedMeasurementInfo = await MeasurementInfoModel.findOneAndDelete(query);

        if (!deletedMeasurementInfo) {
            return sendNotFoundResponse(res, "Measurement info not found or you do not have permission to delete it");
        }

        return sendSuccessResponse(res, "Measurement info deleted successfully");
    } catch (error) {
        console.error('Error deleting measurement info:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};
