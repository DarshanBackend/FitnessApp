import LeaveModel from '../models/leaveModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendForbiddenResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';

// Add a new leave request (Member Only)
export const addLeave = async (req, res) => {
    try {
        // Only members can add leave requests
        if (req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Trainers cannot add leave requests.");
        }


        // Validate required fields
        if (!req.body.from || !req.body.to || !req.body.reason) {
            return sendBadRequestResponse(res, "from, to, and reason are required");
        }

        // Prevent same member from adding leave for any overlapping date range
        const overlappingLeave = await LeaveModel.findOne({
            memberId: req.trainer._id,
            $or: [
                {
                    from: { $lte: req.body.to },
                    to: { $gte: req.body.from }
                }
            ]
        });
        if (overlappingLeave) {
            return sendBadRequestResponse(res, "You already have a leave applied in this date range.");
        }

        // Create new leave request with status Pending
        const newLeave = new LeaveModel({
            from: req.body.from,
            to: req.body.to,
            reason: req.body.reason,
            status: "Pending", // Default status
            memberId: req.trainer._id, // Use logged in member's ID
        });

        const savedLeave = await newLeave.save();
    
        return sendCreatedResponse(res, "Leave request added successfully", savedLeave);
    } catch (error) {
        console.error('Error adding leave request:', error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single leave request by ID (Both Trainers and Members)
export const getLeaveById = async (req, res) => {
    const leaveId = req.params.id; // This is the ID from the URL parameter
 
    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
        return sendBadRequestResponse(res, "Invalid Leave ID");
    }

    try {
        // Find the leave and populate member info
        let leave = await LeaveModel.findById(leaveId).populate('memberId', 'name email contact');

        if (!leave) {
            return sendNotFoundResponse(res, "Leave request not found.");
        }

        // Only allow the member who owns the leave or an admin to view
        if (!req.trainer.isAdmin && leave.memberId && leave.memberId._id.toString() !== req.trainer._id.toString()) {
            return sendForbiddenResponse(res, "Access denied. You can only view your own leave requests.");
        }

        // Format the response with member information
        const formattedLeave = {
            ...leave._doc,
            formattedFrom: dayjs(leave.from).format("DD MMM YYYY"),
            formattedTo: dayjs(leave.to).format("DD MMM YYYY"),
        };
        if (leave.memberId) {
            formattedLeave.memberName = leave.memberId.name;
            formattedLeave.memberEmail = leave.memberId.email;
            formattedLeave.memberContact = leave.memberId.contact;
        }

        return sendSuccessResponse(res, "Leave request retrieved successfully", formattedLeave);
    } catch (error) {
        console.error('Error getting leave request by ID:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all leave requests (Both Trainers and Members)
export const getAllLeave = async (req, res) => {
    try {
        let query = {};
        if (!req.trainer.isAdmin) {
            // Members can only view their own leaves
            query.memberId = req.trainer._id;
         
        } 
        
        // Populate member information only for trainers
        let leaves;
        if (req.trainer.isAdmin) {
            leaves = await LeaveModel.find(query).populate('memberId', 'name email contact').sort({ createdAt: -1 });
        } else {
            leaves = await LeaveModel.find(query).sort({ createdAt: -1 });
        }

        if (!leaves || leaves.length === 0) {
         
            return sendSuccessResponse(res, "No leave requests found", []);
        }

        const formattedLeaves = leaves.map((leave) => {
            const formattedLeave = {
                ...leave._doc,
                formattedFrom: dayjs(leave.from).format("DD MMM YYYY"),
                formattedTo: dayjs(leave.to).format("DD MMM YYYY"),
            };
            
            // Add member information for trainers
            if (req.trainer.isAdmin && leave.memberId) {
                formattedLeave.memberName = leave.memberId.name;
                formattedLeave.memberEmail = leave.memberId.email;
                formattedLeave.memberContact = leave.memberId.contact;
            }
            
            return formattedLeave;
        });

        return sendSuccessResponse(res, "Leave requests retrieved successfully", formattedLeaves);
    } catch (error) {
        console.error('Error getting all leave requests:', error);
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

        // Only allow updating from, to, and reason fields
        const updateFields = {};
        if (req.body.from) updateFields.from = req.body.from;
        if (req.body.to) updateFields.to = req.body.to;
        if (req.body.reason) updateFields.reason = req.body.reason;

        const updatedLeave = await LeaveModel.findByIdAndUpdate(
            req.params.id,
            updateFields,
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
            return sendForbiddenResponse(res, "Only trainers can update leave status.");
        }

        const { status } = req.body;
        if (!status || !["Approved", "Rejected", "Pending"].includes(status)) {
            return sendBadRequestResponse(res, "Invalid status provided. Must be Approved, Rejected, or Pending.");
        }

        const leave = await LeaveModel.findById(req.params.id).populate('memberId', 'name email contact');
        if (!leave) {
            return sendNotFoundResponse(res, "Leave request not found.");
        }

        leave.status = status;
        await leave.save();

        // Format the response with member information
        const formattedLeave = {
            ...leave._doc,
            memberName: leave.memberId.name,
            memberEmail: leave.memberId.email,
            memberContact: leave.memberId.contact,
            formattedFrom: dayjs(leave.from).format("DD MMM YYYY"),
            formattedTo: dayjs(leave.to).format("DD MMM YYYY"),
        };

        return sendSuccessResponse(res, `Leave status updated to ${status} for member ${leave.memberId.name}`, formattedLeave);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
}; 