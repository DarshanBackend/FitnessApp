import MeasurementInfoModel from "../models/measurementInfoModel.js";
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';

// Add a new measurement
export const addMeasurementInfo = async (req, res) => {
    try {
        const newMeasurement = new MeasurementInfoModel(req.body);
        const savedMeasurement = await newMeasurement.save();
        
        const responseData = {
            height: savedMeasurement.height,
            weight: savedMeasurement.weight,
            cheat: savedMeasurement.cheat,
            arms: savedMeasurement.arms,
            forarms: savedMeasurement.forarms,
            hips: savedMeasurement.hips,
            waist: savedMeasurement.waist,
            trunk: savedMeasurement.trunk,
            thaght: savedMeasurement.thaght,
            calf: savedMeasurement.calf,
            _id: savedMeasurement._id,
            createdAt: savedMeasurement.createdAt,
            updatedAt: savedMeasurement.updatedAt,
            __v: savedMeasurement.__v
        };
        
        return sendCreatedResponse(res, "Measurement added successfully", responseData);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single measurement by ID
export const getMeasurementInfoById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Measurement ID");
    }
    try {
        const measurement = await MeasurementInfoModel.findById(req.params.id);
        if (!measurement) {
            return sendNotFoundResponse(res, "Measurement not found");
        }

        const responseData = {
            height: measurement.height,
            weight: measurement.weight,
            cheat: measurement.cheat,
            arms: measurement.arms,
            forarms: measurement.forarms,
            hips: measurement.hips,
            waist: measurement.waist,
            trunk: measurement.trunk,
            thaght: measurement.thaght,
            calf: measurement.calf,
            _id: measurement._id,
            createdAt: measurement.createdAt,
            updatedAt: measurement.updatedAt,
            __v: measurement.__v
        };

        return sendSuccessResponse(res, "Measurement retrieved successfully", responseData);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all measurements
export const getAllMeasurementInfo = async (req, res) => {
    try {
        const measurements = await MeasurementInfoModel.find().sort({ createdAt: -1 });

        if (!measurements || measurements.length === 0) {
            return sendSuccessResponse(res, "No measurements found", []);
        }

        const formattedMeasurements = measurements.map((measurement) => {
            return {
                height: measurement.height,
                weight: measurement.weight,
                cheat: measurement.cheat,
                arms: measurement.arms,
                forarms: measurement.forarms,
                hips: measurement.hips,
                waist: measurement.waist,
                trunk: measurement.trunk,
                thaght: measurement.thaght,
                calf: measurement.calf,
                _id: measurement._id,
                createdAt: measurement.createdAt,
                updatedAt: measurement.updatedAt,
                __v: measurement.__v,
                formattedDate: dayjs(measurement.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Measurements retrieved successfully", formattedMeasurements);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a measurement by ID
export const updateMeasurementInfo = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Measurement ID");
    }
    try {
        const updatedMeasurement = await MeasurementInfoModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMeasurement) {
            return sendNotFoundResponse(res, "Measurement not found");
        }

        const responseData = {
            height: updatedMeasurement.height,
            weight: updatedMeasurement.weight,
            cheat: updatedMeasurement.cheat,
            arms: updatedMeasurement.arms,
            forarms: updatedMeasurement.forarms,
            hips: updatedMeasurement.hips,
            waist: updatedMeasurement.waist,
            trunk: updatedMeasurement.trunk,
            thaght: updatedMeasurement.thaght,
            calf: updatedMeasurement.calf,
            _id: updatedMeasurement._id,
            createdAt: updatedMeasurement.createdAt,
            updatedAt: updatedMeasurement.updatedAt,
            __v: updatedMeasurement.__v
        };

        return sendSuccessResponse(res, "Measurement updated successfully", responseData);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a measurement by ID
export const deleteMeasurementInfo = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Measurement ID");
    }
    try {
        const deletedMeasurement = await MeasurementInfoModel.findByIdAndDelete(req.params.id);
        if (!deletedMeasurement) {
            return sendNotFoundResponse(res, "Measurement not found");
        }
        return sendSuccessResponse(res, "Measurement deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};
