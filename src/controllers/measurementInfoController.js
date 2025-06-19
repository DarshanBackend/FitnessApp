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
            return sendBadRequestResponse(res, "Trainers must provide a memberId parameter to view a member's measurement info.");
        }

        // Find all measurements for the member
        const measurements = await MeasurementInfoModel.find({ memberId }).sort({ createdAt: -1 });
    
        if (!measurements || measurements.length === 0) {
            return sendNotFoundResponse(res, "No measurements found for this member");
        }

        // Format measurements with dates
        const formattedMeasurements = measurements.map((measurement) => {
            return {
                ...measurement._doc,
                formattedDate: dayjs(measurement.createdAt).format("DD MMM YYYY"),
            };
        });

        // Group measurements by addedDate (date only, not time)
        const measurementsByDay = formattedMeasurements.reduce((acc, measurement) => {
            const day = measurement.formattedDate;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(measurement);
            return acc;
        }, {});

        return sendSuccessResponse(res, "Measurements retrieved successfully", measurementsByDay);
    } catch (error) {
        console.error('Error getting measurements:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all measurement info
export const getAllMeasurementInfo = async (req, res) => {
    try {
        let query = {};
        let responseMessage = "All measurements retrieved successfully";

        if (!req.trainer.isAdmin) {
            // Member: Show their specific measurements
            query = { memberId: req.trainer._id };
            responseMessage = "Your measurements retrieved successfully";
        } else if (req.query.memberId) {
            // Trainer with memberId query: Show that member's specific measurements
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = { memberId: req.query.memberId };
            responseMessage = `Measurements for member ${req.query.memberId} retrieved successfully`;
        }

        const measurements = await MeasurementInfoModel.find(query).sort({ createdAt: -1 });
        
        if (!measurements || measurements.length === 0) {
            return sendSuccessResponse(res, "No measurements found", []);
        }

        // Format measurements with dates
        const formattedMeasurements = measurements.map((measurement) => {
            return {
                ...measurement._doc,
                formattedDate: dayjs(measurement.createdAt).format("DD MMM YYYY"),
                addedDate: dayjs(measurement.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, responseMessage, formattedMeasurements);
    } catch (error) {
        console.error('Error getting all measurements:', error);
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
