import LeaveModel from '../models/leaveModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendForbiddenResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';

// Add a new leave request (Member Only)
export const addLeave = async (req, res) => {
    try {
        if (req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Trainers cannot add leave requests.");
        }

        const newLeave = new LeaveModel({
            ...req.body,
            memberId: req.trainer._id,
        });
        const savedLeave = await newLeave.save();
        return sendCreatedResponse(res, "Leave request added successfully", savedLeave);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single leave request by ID (Both Trainers and Members)
export const getLeaveById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Leave ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            // Members can only view their own leaves
            query.memberId = req.trainer._id;
        }
        const leave = await LeaveModel.findOne(query);
        if (!leave) {
            return sendNotFoundResponse(res, "Leave request not found or you do not have permission to view it.");
        }
        return sendSuccessResponse(res, "Leave request retrieved successfully", leave);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all leave requests (Both Trainers and Members)
export const getAllLeave = async (req, res) => {
    try {
        let query = {};
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const leaves = await LeaveModel.find(query).sort({ createdAt: -1 });

        if (!leaves || leaves.length === 0) {
            return sendSuccessResponse(res, "No leave requests found", []);
        }

        const formattedLeaves = leaves.map((leave) => {
            return {
                ...leave._doc,
                formattedDate: dayjs(leave.createdAtdate).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Leave requests retrieved successfully", formattedLeaves);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a leave request (Member Only, if Pending)
export const updateLeave = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Leave ID");
    }
    try {
        if (req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Trainers cannot update leave requests.");
        }

        const leave = await LeaveModel.findOne({ _id: req.params.id, memberId: req.trainer._id });
        if (!leave) {
            return sendNotFoundResponse(res, "Leave request not found or you do not have permission to update it.");
        }

        if (leave.status !== "Pending") {
            return sendBadRequestResponse(res, "Only pending leave requests can be updated.");
        }

        const updatedLeave = await LeaveModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        return sendSuccessResponse(res, "Leave request updated successfully", updatedLeave);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a leave request (Member Only, if Pending)
export const deleteLeave = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Leave ID");
    }
    try {
        if (req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Trainers cannot delete leave requests.");
        }

        const leave = await LeaveModel.findOne({ _id: req.params.id, memberId: req.trainer._id });
        if (!leave) {
            return sendNotFoundResponse(res, "Leave request not found or you do not have permission to delete it.");
        }

        if (leave.status !== "Pending") {
            return sendBadRequestResponse(res, "Only pending leave requests can be deleted.");
        }

        const deletedLeave = await LeaveModel.findByIdAndDelete(req.params.id);
        return sendSuccessResponse(res, "Leave request deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update leave status (Trainer Only)
export const updateLeaveStatus = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Leave ID");
    }
    try {
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Members cannot update leave status.");
        }

        const { status } = req.body;
        if (!status || !["Approved", "Rejected", "Pending"].includes(status)) {
            return sendBadRequestResponse(res, "Invalid status provided. Must be Approved, Rejected, or Pending.");
        }

        const leave = await LeaveModel.findById(req.params.id);
        if (!leave) {
            return sendNotFoundResponse(res, "Leave request not found.");
        }

        leave.status = status;
        await leave.save();

        return sendSuccessResponse(res, "Leave status updated successfully", leave);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
}; 