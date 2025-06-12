import Vo2MaxRockPortTestModel from '../models/Vo2MaxRockPortTestModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';


// Add a new vo2MaxRockPortTest
export const addvo2MaxRockPortTest = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add VO2 Max Rock Port Test data for a member.");
            }

            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }

        

        const newvo2MaxRockPortTest = new Vo2MaxRockPortTestModel({
            ...req.body,
            memberId: memberId
        });
        const savedvo2MaxRockPortTest = await newvo2MaxRockPortTest.save();
        return sendCreatedResponse(res, "VO2 Max Rock Port Test record added successfully", savedvo2MaxRockPortTest);
    } catch (error) {
        console.error("Error adding VO2 Max Rock Port Test record:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single vo2MaxRockPortTest by ID
export const getvo2MaxRockPortTestById = async (req, res) => {
    try {
       
        // Use the validated member from middleware
        const vo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findOne({ memberId: req.member._id });
       
        
        if (!vo2MaxRockPortTest) {
            return sendNotFoundResponse(res, "VO2 Max Rock Port Test not found");
        }

        return sendSuccessResponse(res, "VO2 Max Rock Port Test retrieved successfully", vo2MaxRockPortTest);
    } catch (error) {
        console.error('Error getting VO2 Max Rock Port Test:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all vo2MaxRockPortTests
export const getAllvo2MaxRockPortTest = async (req, res) => {
    try {
        let query = {};
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }


        const vo2MaxRockPortTests = await Vo2MaxRockPortTestModel.find(query).sort({ createdAt: -1 });

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
        console.error("Error retrieving all VO2 Max Rock Port Test records:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a vo2MaxRockPortTest by ID
export const updatevo2MaxRockPortTest = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid VO2 Max Rock Port Test ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

       

        const updatedvo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findOneAndUpdate(
            query,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedvo2MaxRockPortTest) {
            return sendNotFoundResponse(res, "VO2 Max Rock Port Test not found or you do not have permission to update it.");
        }
        return sendSuccessResponse(res, "VO2 Max Rock Port Test updated successfully", updatedvo2MaxRockPortTest);
    } catch (error) {
        console.error("Error updating VO2 Max Rock Port Test record:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a vo2MaxRockPortTest by ID
export const deletevo2MaxRockPortTest = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid VO2 Max Rock Port Test ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

     

        const deletedvo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findOneAndDelete(query);
        if (!deletedvo2MaxRockPortTest) {
            return sendNotFoundResponse(res, "VO2 Max Rock Port Test not found or you do not have permission to delete it.");
        }
        return sendSuccessResponse(res, "VO2 Max Rock Port Test deleted successfully");
    } catch (error) {
        console.error("Error deleting VO2 Max Rock Port Test record:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};
