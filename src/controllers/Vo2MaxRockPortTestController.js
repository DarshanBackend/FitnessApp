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
            return sendBadRequestResponse(res, "Trainers must provide a memberId parameter to view a member's VO2 Max Rock Port Test records.");
        }

        // Find all records for the member
        const vo2MaxRockPortTests = await Vo2MaxRockPortTestModel.find({ memberId }).sort({ createdAt: -1 });
    
        if (!vo2MaxRockPortTests || vo2MaxRockPortTests.length === 0) {
            return sendNotFoundResponse(res, "No VO2 Max Rock Port Test records found for this member");
        }

        // Format records with dates
        const formattedVo2MaxRockPortTests = vo2MaxRockPortTests.map((vo2MaxRockPortTest) => {
            return {
                ...vo2MaxRockPortTest._doc,
                formattedDate: dayjs(vo2MaxRockPortTest.createdAt).format("DD MMM YYYY")
            };
        });



        return sendSuccessResponse(res, "VO2 Max Rock Port Test records retrieved successfully", formattedVo2MaxRockPortTests);
    } catch (error) {
        console.error('Error getting VO2 Max Rock Port Test:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all vo2MaxRockPortTests
export const getAllvo2MaxRockPortTest = async (req, res) => {
    try {
        let query = {};
        let responseMessage = "All VO2 Max Rock Port Test records retrieved successfully";

        if (!req.trainer.isAdmin) {
            // Member: Show their specific measurements
            query = { memberId: req.trainer._id };
            responseMessage = "Your VO2 Max Rock Port Test records retrieved successfully";
        } else if (req.query.memberId) {
            // Trainer with memberId query: Show that member's specific measurements
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = { memberId: req.query.memberId };
            responseMessage = `VO2 Max Rock Port Test records for member ${req.query.memberId} retrieved successfully`;
        }

        const vo2MaxRockPortTests = await Vo2MaxRockPortTestModel.find(query).sort({ createdAt: -1 });

        if (!vo2MaxRockPortTests || vo2MaxRockPortTests.length === 0) {
            return sendSuccessResponse(res, "No VO2 Max Rock Port Test records found", []);
        }

        const formattedVo2MaxRockPortTests = vo2MaxRockPortTests.map((vo2MaxRockPortTest) => {
            return {
                ...vo2MaxRockPortTest._doc,
                formattedDate: dayjs(vo2MaxRockPortTest.createdAt).format("DD MMM YYYY")
            };
        });

        return sendSuccessResponse(res, responseMessage, formattedVo2MaxRockPortTests);
    } catch (error) {
        console.error("Error retrieving all VO2 Max Rock Port Test records:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update vo2MaxRockPortTest
export const updatevo2MaxRockPortTest = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid VO2 Max Rock Port Test ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const updatedvo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findOneAndUpdate(
            query,
            { ...req.body },
            { new: true }
        );

        if (!updatedvo2MaxRockPortTest) {
            return sendNotFoundResponse(res, "VO2 Max Rock Port Test not found or you do not have permission to update it");
        }

        return sendSuccessResponse(res, "VO2 Max Rock Port Test updated successfully", updatedvo2MaxRockPortTest);
    } catch (error) {
        console.error('Error updating VO2 Max Rock Port Test:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete vo2MaxRockPortTest
export const deletevo2MaxRockPortTest = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid VO2 Max Rock Port Test ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const deletedvo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findOneAndDelete(query);

        if (!deletedvo2MaxRockPortTest) {
            return sendNotFoundResponse(res, "VO2 Max Rock Port Test not found or you do not have permission to delete it");
        }

        return sendSuccessResponse(res, "VO2 Max Rock Port Test deleted successfully");
    } catch (error) {
        console.error('Error deleting VO2 Max Rock Port Test:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};
