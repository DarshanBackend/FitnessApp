import WaisttoHipRatioModel from '../models/WaisttoHipRatioModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendCreatedResponse, sendNotFoundResponse, sendBadRequestResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Add a new WaisttoHipRatio
export const addWaisttoHipRatio = async (req, res) => {
    try {
      

        let memberId;
        if (req.trainer.isAdmin) {
            if (!req.body.memberId) {
              
                return sendBadRequestResponse(res, "memberId is required for trainers to add waist to hip ratio data for a member.");
            }

            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
            
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }

      
        const newWaisttoHipRatio = new WaisttoHipRatioModel({
            ...req.body,
            memberId: memberId
        });


        const savedWaisttoHipRatio = await newWaisttoHipRatio.save();
       

        return sendCreatedResponse(res, "Waist to Hip Ratio added successfully", savedWaisttoHipRatio);
    } catch (error) {
        console.error("Error adding waist to hip ratio record:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single WaisttoHipRatio by ID
export const getWaisttoHipRatioById = async (req, res) => {
    try {

        // Use the validated member from middleware
        const waisttoHipRatio = await WaisttoHipRatioModel.findOne({ memberId: req.member._id });
   
        if (!waisttoHipRatio) {
            return sendNotFoundResponse(res, "Waist to Hip Ratio not found");
        }

        return sendSuccessResponse(res, "Waist to Hip Ratio retrieved successfully", waisttoHipRatio);
    } catch (error) {
        console.error('Error getting waist to hip ratio:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all WaisttoHipRatios
export const getAllWaisttoHipRatio = async (req, res) => {
    try {
        
        let query = {};
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }


        const WaisttoHipRatios = await WaisttoHipRatioModel.find(query).sort({ createdAt: -1 });
    
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
        console.error("Error retrieving all waist to hip ratio records:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a WaisttoHipRatio by ID
export const updateWaisttoHipRatio = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Waist to Hip Ratio ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

       

        const updatedWaisttoHipRatio = await WaisttoHipRatioModel.findOneAndUpdate(
            query,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedWaisttoHipRatio) {
            return sendNotFoundResponse(res, "Waist to Hip Ratio not found or you do not have permission to update it.");
        }
        return sendSuccessResponse(res, "Waist to Hip Ratio updated successfully", updatedWaisttoHipRatio);
    } catch (error) {
        console.error("Error updating waist to hip ratio record:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a WaisttoHipRatio by ID
export const deleteWaisttoHipRatio = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Waist to Hip Ratio ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

       

        const deletedWaisttoHipRatio = await WaisttoHipRatioModel.findOneAndDelete(query);
        if (!deletedWaisttoHipRatio) {
            return sendNotFoundResponse(res, "Waist to Hip Ratio not found or you do not have permission to delete it.");
        }
        return sendSuccessResponse(res, "Waist to Hip Ratio deleted successfully");
    } catch (error) {
        console.error("Error deleting waist to hip ratio record:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};