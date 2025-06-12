import WaisttoHipRatioModel from '../models/WaisttoHipRatioModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendCreatedResponse, sendNotFoundResponse, sendBadRequestResponse } from '../utils/ResponseUtils.js';

// Add a new WaisttoHipRatio
export const addWaisttoHipRatio = async (req, res) => {
    try {
        const newWaisttoHipRatio = new WaisttoHipRatioModel(req.body);
        const savedWaisttoHipRatio = await newWaisttoHipRatio.save();
        return sendCreatedResponse(res, "Waist to Hip Ratio added successfully", savedWaisttoHipRatio);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single WaisttoHipRatio by ID
export const getWaisttoHipRatioById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Waist to Hip Ratio ID");
    }
    try {
        const WaisttoHipRatio = await WaisttoHipRatioModel.findById(req.params.id);
        if (!WaisttoHipRatio) {
            return sendNotFoundResponse(res, "Waist to Hip Ratio not found");
        }
        return sendSuccessResponse(res, "Waist to Hip Ratio retrieved successfully", WaisttoHipRatio);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all WaisttoHipRatios
export const getAllWaisttoHipRatio = async (req, res) => {
    try {
        const WaisttoHipRatios = await WaisttoHipRatioModel.find().sort({ createdAt: -1 });

        if (!WaisttoHipRatios || WaisttoHipRatios.length === 0) {
            return sendSuccessResponse(res, "No Waist to Hip Ratios found", []);
        }

        const formattedWaisttoHipRatios = WaisttoHipRatios.map((WaisttoHipRatio) => {
            return {
                ...WaisttoHipRatio._doc,
                formattedDate: dayjs(WaisttoHipRatio.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Waist to Hip Ratios retrieved successfully", formattedWaisttoHipRatios);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a WaisttoHipRatio by ID
export const updateWaisttoHipRatio = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Waist to Hip Ratio ID");
    }
    try {
        const updatedWaisttoHipRatio = await WaisttoHipRatioModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedWaisttoHipRatio) {
            return sendNotFoundResponse(res, "Waist to Hip Ratio not found");
        }
        return sendSuccessResponse(res, "Waist to Hip Ratio updated successfully", updatedWaisttoHipRatio);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a WaisttoHipRatio by ID
export const deleteWaisttoHipRatio = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Waist to Hip Ratio ID" });
    }
    try {
        const deletedWaisttoHipRatio = await WaisttoHipRatioModel.findByIdAndDelete(req.params.id);
        if (!deletedWaisttoHipRatio) {
            return res.status(404).json({ message: "Waist to Hip Ratio not found" });
        }
        res.status(200).json({ message: "Waist to Hip Ratio deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};