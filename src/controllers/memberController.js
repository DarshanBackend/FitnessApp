import mongoose from 'mongoose';
import registerModel from '../models/registerModel.js';
import MemberDetails from '../models/memberDetailsModel.js';
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
dayjs.extend(isSameOrBefore);
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Utility to add months and days to a date string (YYYY-MM-DD)
function addMonthsAndDays(dateStr, months, days = 0) {
    let date = dayjs(dateStr);
    date = date.add(months, 'month').add(days, 'day');
    return date.format('YYYY-MM-DD');
}

// Create member details (trainer only)
export const createMemberDetails = async (req, res) => {
    try {
        const { member, member_startDate, member_month = 12, member_goal, goal_status, member_due, member_status } = req.body;
        if (!req.trainer || !req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Only trainers can create member details");
        }
        // Check that the target user is a member, not a trainer
        const target = await registerModel.findById(member);
        if (!target) {
            return sendNotFoundResponse(res, "Target member not found");
        }
        if (target.type !== 'member') {
            return sendBadRequestResponse(res, "Cannot add member details to a trainer");
        }
        // Prevent duplicate details
        const exists = await MemberDetails.findOne({ user: member });
        if (exists) {
            return sendBadRequestResponse(res, "Member details already exist. Use update instead.");
        }
        let startDate = member_startDate || dayjs().format('YYYY-MM-DD');
        // Always format startDate
        const parsedStart = dayjs(startDate, ["YYYY-MM-DD", "DD-MM-YYYY", "YYYY/MM/DD", "DD/MM/YYYY"]);
        if (!parsedStart.isValid()) {
            return sendBadRequestResponse(res, "Invalid start date format. Use YYYY-MM-DD or DD-MM-YYYY");
        }
        startDate = parsedStart.format("YYYY-MM-DD");
        let months = Number(member_month) || 12;
        let endDate = addMonthsAndDays(startDate, months);
        // Set status to Expired if endDate is in the past or today
        let status = member_status || 'Active';
        if (dayjs(endDate).isSameOrBefore(dayjs(), 'day')) {
            status = 'Expired';
        }
        const details = await MemberDetails.create({
            user: member,
            member_startDate: startDate,
            member_endDate: endDate,
            member_status: status,
            member_month: months,
            member_goal: member_goal || 'Fitness',
            goal_status: goal_status || 'Completed',
            member_due: member_due || 0
        });
        return sendCreatedResponse(res, "Member details created successfully", details);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get member details by ID (trainer can view any, member can only view self)
export const getMemberDetailsById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid MemberDetails ID");
        }

        if (!req.trainer) {
            return sendForbiddenResponse(res, "Authentication required");
        }
        if (!req.trainer.isAdmin && req.trainer._id.toString() !== id) {
            return sendForbiddenResponse(res, "Access denied. You can only view your own profile.");
        }
        const details = await MemberDetails.findOne({ user: id }).populate('user', 'name email contact');
        if (!details) {
            return sendNotFoundResponse(res, "Member details not found");
        }
        return sendSuccessResponse(res, "Member details retrieved successfully", details);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all member details (trainer only, or self if member)
export const getAllMemberDetails = async (req, res) => {
    try {
        let filter = {};
        if (!req.trainer.isAdmin) {
            filter.user = req.trainer._id;
        }

        const details = await MemberDetails.find(filter).populate('user', 'name email contact');

        if (!details || details.length === 0) {
            return sendSuccessResponse(res, "No details plans found", []);
        }
        return sendSuccessResponse(res, "Member details fetched successfully", details);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update member details (trainer only)
export const updateMemberDetails = async (req, res) => {
    try {
        const { id } = req.params; // id = user id
        const { member_startDate, member_month, member_goal, goal_status, member_due, member_status, leave_days } = req.body;
        if (!req.trainer || !req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Only trainers can update member details");
        }
        const details = await MemberDetails.findOne({ user: id });
        if (!details) {
            return sendNotFoundResponse(res, "Member details not found");
        }
        // Always parse and format the start date to YYYY-MM-DD
        let startDate = details.member_startDate;
        if (member_startDate) {
            // Try to parse the incoming date
            const parsed = dayjs(member_startDate, ["YYYY-MM-DD", "DD-MM-YYYY", "YYYY/MM/DD", "DD/MM/YYYY"]);
            if (!parsed.isValid()) {
                return sendBadRequestResponse(res, "Invalid start date format. Use YYYY-MM-DD or DD-MM-YYYY");
            }
            startDate = parsed.format("YYYY-MM-DD");
            details.member_startDate = startDate;
        }
        if (member_month) details.member_month = member_month;
        if (member_goal) details.member_goal = member_goal;
        if (goal_status) details.goal_status = goal_status;
        if (member_due) details.member_due = member_due;
        if (member_status) details.member_status = member_status;
        // Handle leave_days: extend end date by leave_days if provided
        if (typeof leave_days === 'number' && leave_days > 0) {
            let currentEndDate = details.member_endDate || dayjs().format('YYYY-MM-DD');
            let newEndDate = addMonthsAndDays(currentEndDate, 0, leave_days);
            details.member_endDate = newEndDate;
        } else if (member_startDate || member_month) {
            // If start date or months changed, recalculate end date
            let months = Number(member_month) || details.member_month || 12;
            details.member_endDate = addMonthsAndDays(startDate, months);
        }
        // Set status to Expired if endDate is in the past or today
        if (details.member_endDate && dayjs(details.member_endDate).isSameOrBefore(dayjs(), 'day')) {
            details.member_status = 'Expired';
        }
        await details.save();
        const updated = await MemberDetails.findOne({ user: id }).populate('user', 'name email contact');
        return sendSuccessResponse(res, "Member details updated successfully", updated);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete member details (trainer only)
export const deleteMemberDetails = async (req, res) => {
    try {
        const { id } = req.params; // id = user id
        if (!req.trainer || !req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Only trainers can delete member details");
        }
        const details = await MemberDetails.findOne({ user: id });
        if (!details) {
            return sendNotFoundResponse(res, "Member details not found");
        }
        await MemberDetails.deleteOne({ user: id });
        return sendSuccessResponse(res, "Member details deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get member profile (only basic info)
export const getMemberProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Member ID");
        }
        // Only allow self or trainer
        if (!req.trainer) {
            return sendForbiddenResponse(res, "Authentication required");
        }
        if (!req.trainer.isAdmin && req.trainer._id.toString() !== id) {
            return sendForbiddenResponse(res, "Access denied. You can only view your own profile.");
        }
        // Get user basic info
        const user = await registerModel.findById(id).select('name contact email birth_date trainer_image');
        if (!user) {
            return sendNotFoundResponse(res, "Member not found");
        }
        // Get enrolled date from MemberDetails
        const details = await MemberDetails.findOne({ user: id });
        let enrolledDate = details && details.member_startDate ? dayjs(details.member_startDate).format('DD/MM/YYYY') : "-";
        let birthDate = user.birth_date ? dayjs(user.birth_date).format('DD/MM/YYYY') : "-";
        const response = {
            memberId: user.id || "-",
            name: user.name || "-",
            contact: user.contact || "-",
            email: user.email || "-",
            birth_date: birthDate,
            enrolled_date: enrolledDate,
            image: user.trainer_image || "-"
        };
        return sendSuccessResponse(res, "Member profile fetched successfully", response);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};
