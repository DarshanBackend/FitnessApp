import LeaveModel from '../models/leaveModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";

// Add a new leave request (Member Only)
export const addLeave = async (req, res) => {
    try {
        if (req.trainer.isAdmin) {
            return res.status(403).json({ message: "Trainers cannot add leave requests." });
        }

        const newLeave = new LeaveModel({
            ...req.body,
            memberId: req.trainer._id,
        });
        const savedLeave = await newLeave.save();
        res.status(201).json(savedLeave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single leave request by ID (Both Trainers and Members)
export const getLeaveById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Leave ID" });
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            // Members can only view their own leaves
            query.memberId = req.trainer._id;
        }
        const leave = await LeaveModel.findOne(query);
        if (!leave) {
            return res.status(404).json({ message: "Leave request not found or you do not have permission to view it." });
        }
        res.status(200).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            return res.status(200).json({ message: "No leave requests found!!" });
        }

        const formattedLeaves = leaves.map((leave) => {
            return {
                ...leave._doc,
                formattedDate: dayjs(leave.createdAtdate).format("DD MMM YYYY"),
            };
        });

        res.status(200).json(formattedLeaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a leave request (Member Only, if Pending)
export const updateLeave = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Leave ID" });
    }
    try {
        if (req.trainer.isAdmin) {
            return res.status(403).json({ message: "Trainers cannot update leave requests." });
        }

        const leave = await LeaveModel.findOne({ _id: req.params.id, memberId: req.trainer._id });
        if (!leave) {
            return res.status(404).json({ message: "Leave request not found or you do not have permission to update it." });
        }

        if (leave.status !== "Pending") {
            return res.status(400).json({ message: "Only pending leave requests can be updated." });
        }

        const updatedLeave = await LeaveModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedLeave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a leave request (Member Only, if Pending)
export const deleteLeave = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Leave ID" });
    }
    try {
        if (req.trainer.isAdmin) {
            return res.status(403).json({ message: "Trainers cannot delete leave requests." });
        }

        const leave = await LeaveModel.findOne({ _id: req.params.id, memberId: req.trainer._id });
        if (!leave) {
            return res.status(404).json({ message: "Leave request not found or you do not have permission to delete it." });
        }

        if (leave.status !== "Pending") {
            return res.status(400).json({ message: "Only pending leave requests can be deleted." });
        }

        const deletedLeave = await LeaveModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Leave request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update leave status (Trainer Only)
export const updateLeaveStatus = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Leave ID" });
    }
    try {
        if (!req.trainer.isAdmin) {
            return res.status(403).json({ message: "Members cannot update leave status." });
        }

        const { status } = req.body;
        if (!status || !["Approved", "Rejected", "Pending"].includes(status)) {
            return res.status(400).json({ message: "Invalid status provided. Must be Approved, Rejected, or Pending." });
        }

        const leave = await LeaveModel.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ message: "Leave request not found." });
        }

        leave.status = status;
        await leave.save();

        res.status(200).json(leave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 