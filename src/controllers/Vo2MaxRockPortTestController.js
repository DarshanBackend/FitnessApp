import Vo2MaxRockPortTestModel from '../models/Vo2MaxRockPortTestModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';


// Add a new vo2MaxRockPortTest
export const addvo2MaxRockPortTest = async (req, res) => {
    try {
        const newvo2MaxRockPortTest = new Vo2MaxRockPortTestModel(req.body);
        const savedvo2MaxRockPortTest = await newvo2MaxRockPortTest.save();
        return sendCreatedResponse(res, "VO2 Max Rock Port Test record added successfully", savedvo2MaxRockPortTest);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single vo2MaxRockPortTest by ID
export const getvo2MaxRockPortTestById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid VO2 Max Rock Port Test ID");
    }
    try {
        const vo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findById(req.params.id);
        if (!vo2MaxRockPortTest) {
            return sendNotFoundResponse(res, "VO2 Max Rock Port Test not found");
        }
        return sendSuccessResponse(res, "VO2 Max Rock Port Test retrieved successfully", vo2MaxRockPortTest);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all vo2MaxRockPortTests
export const getAllvo2MaxRockPortTest = async (req, res) => {
    try {
        const vo2MaxRockPortTests = await Vo2MaxRockPortTestModel.find().sort({ createdAt: -1 });

        if (!vo2MaxRockPortTests || vo2MaxRockPortTests.length === 0) {
            return sendSuccessResponse(res, "No VO2 Max Rock Port Test records found", []);
        }

        const formattedvo2MaxRockPortTests = vo2MaxRockPortTests.map((vo2MaxRockPortTest) => {
            return {
                ...vo2MaxRockPortTest._doc,
                formattedDate: dayjs(vo2MaxRockPortTest.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "VO2 Max Rock Port Test records retrieved successfully", formattedvo2MaxRockPortTests);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a vo2MaxRockPortTest by ID
export const updatevo2MaxRockPortTest = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid VO2 Max Rock Port Test ID");
    }
    try {
        const updatedvo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedvo2MaxRockPortTest) {
            return sendNotFoundResponse(res, "VO2 Max Rock Port Test not found");
        }
        return sendSuccessResponse(res, "VO2 Max Rock Port Test updated successfully", updatedvo2MaxRockPortTest);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a vo2MaxRockPortTest by ID
export const deletevo2MaxRockPortTest = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid VO2 Max Rock Port Test ID");
    }
    try {
        const deletedvo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findByIdAndDelete(req.params.id);
        if (!deletedvo2MaxRockPortTest) {
            return sendNotFoundResponse(res, "VO2 Max Rock Port Test not found");
        }
        return sendSuccessResponse(res, "VO2 Max Rock Port Test deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};
