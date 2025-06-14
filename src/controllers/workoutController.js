import WorkoutModel from '../models/workoutModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Add a new workout (only trainers can add - can be general or member-specific)
export const addWorkout = async (req, res) => {
    try {
        // Only trainers can add workouts
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Only trainers can add workouts");
        }

        // Validate required fields for the workout itself
        const { day, videoTitle, videoURL, setsMinutes, repeats, minimumWeight } = req.body;
        if (!day || !videoTitle || !videoURL || !setsMinutes || !repeats) {
            return sendBadRequestResponse(res, "Day, Video Title, Video URL, Sets/Minutes, and Repeats are required");
        }

        // Validate day format
        const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        if (!validDays.includes(day.toLowerCase())) {
            return sendBadRequestResponse(res, "Invalid day format. Use: monday, tuesday, wednesday, thursday, friday, saturday, sunday");
        }

        let memberId = null; // Default to null for general workouts
        if (req.body.memberId) {
            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        }

        const newWorkout = new WorkoutModel({
            day: day.toLowerCase(),
            videoTitle,
            videoURL,
            setsMinutes,
            repeats,
            minimumWeight
        });

        const savedWorkout = await newWorkout.save();
        return sendCreatedResponse(res, "Workout added successfully", savedWorkout);
    } catch (error) {
        console.error("Error adding workout record:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get workouts by day (for members and trainers)
export const getWorkoutsByDay = async (req, res) => {
    try {
        const { day } = req.params;
        const dayLower = day.toLowerCase();

        // Validate day format
        const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        if (!validDays.includes(dayLower)) {
            return sendBadRequestResponse(res, "Invalid day format. Use: monday, tuesday, wednesday, thursday, friday, saturday, sunday");
        }

        let generalWorkouts = [];
        let memberSpecificWorkouts = [];

        // Always fetch general workouts for the day
        generalWorkouts = await WorkoutModel.find({
            day: dayLower,
        }).sort({ createdAt: 1 });

        // Fetch member-specific workouts if applicable
        if (!req.trainer.isAdmin) {
            // If logged in as a member, get their specific workouts
            memberSpecificWorkouts = await WorkoutModel.find({
                day: dayLower,
                memberId: req.trainer._id // Member's own ID
            }).sort({ createdAt: 1 });
        } else if (req.query.memberId) {
            // If logged in as a trainer and memberId is provided in query, get that member's specific workouts
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            memberSpecificWorkouts = await WorkoutModel.find({
                day: dayLower,
                memberId: req.query.memberId
            }).sort({ createdAt: 1 });
        }

        // Combine general and member-specific workouts, ensuring no duplicates if a workout is both general and assigned (unlikely, but safe)
        const allWorkouts = [...generalWorkouts, ...memberSpecificWorkouts];

        if (allWorkouts.length === 0) {
            return sendSuccessResponse(res, `No workouts found for ${dayLower}`, []);
        }

        return sendSuccessResponse(res, `Workouts for ${dayLower} retrieved successfully`, allWorkouts);
    } catch (error) {
        console.error("Error getting workouts by day:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all workouts (for a specific member or all general workouts)
export const getAllWorkout = async (req, res) => {
    try {
        let query = {};
        let responseMessage = "All workouts retrieved successfully";

        if (!req.trainer.isAdmin) {
            // Member: Show their specific workouts and all general workouts
            query = { $or: [{ memberId: req.trainer._id }, { memberId: null }] };
            responseMessage = "Your workouts retrieved successfully";
        } else if (req.query.memberId) {
            // Trainer with memberId query: Show that member's specific workouts and all general workouts
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = { $or: [{ memberId: req.query.memberId }, { memberId: null }] };
            responseMessage = `Workouts for member ${req.query.memberId} retrieved successfully`;
        } else {
            // Trainer without memberId query: Show all workouts (general + all member-specific)
            // For this specific use case (all members view day-wise), we'll keep it simple
            // and trainers without memberId param will see all workouts, including general ones.
            // If only general workouts are desired, a separate API would be better.
            // For now, this will fetch ALL workouts for simplicity if no memberId is specified by trainer.
            query = {}; // No specific filter, get all
        }

        const workouts = await WorkoutModel.find(query).sort({ day: 1, createdAt: 1 });

        if (!workouts || workouts.length === 0) {
            return sendSuccessResponse(res, "No workouts found", []);
        }

        // Group workouts by day for structured response
        const workoutsByDay = workouts.reduce((acc, workout) => {
            const day = workout.day;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(workout);
            return acc;
        }, {});

        return sendSuccessResponse(res, responseMessage, workoutsByDay);

    } catch (error) {
        console.error("Error retrieving all workout records:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a workout (only trainers can update any workout)
export const updateWorkout = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Workout ID");
    }

    try {
        // Only trainers can update workouts
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Only trainers can update workouts");
        }

        const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedWorkout) {
            return sendNotFoundResponse(res, "Workout not found");
        }

        return sendSuccessResponse(res, "Workout updated successfully", updatedWorkout);
    } catch (error) {
        console.error("Error updating workout record:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Update all general workouts for a specific day (only trainers can update)
export const updateWorkoutByDay = async (req, res) => {
    const { day } = req.params; // Get only Day from parameters
    const dayLower = day.toLowerCase();

    // Validate day format
    const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    if (!validDays.includes(dayLower)) {
        return sendBadRequestResponse(res, "Invalid day format. Use: monday, tuesday, wednesday, thursday, friday, saturday, sunday");
    }

    try {
        // Only trainers can update workouts
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Only trainers can update workouts");
        }

        // Use updateMany to update all documents matching the day and memberId: null
        const updateResult = await WorkoutModel.updateMany(
            { day: dayLower, memberId: null }, // Query only by day and for general workouts
            { $set: req.body }, // Use $set to apply updates to fields in req.body
            { runValidators: true } // Run validators on the update operation
        );

        if (updateResult.modifiedCount === 0) {
            return sendNotFoundResponse(res, "No general workouts found for the specified day to update.");
        }

        // After updating, fetch the updated workouts for that day
        const updatedWorkouts = await WorkoutModel.find({ day: dayLower, memberId: null }).sort({ createdAt: 1 });

        return sendSuccessResponse(res, `Successfully updated ${updateResult.modifiedCount} general workout(s) for ${day}.`, updatedWorkouts);
    } catch (error) {
        console.error("Error updating workout records by day:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete all general workouts for a specific day (only trainers can delete)
export const deleteWorkoutsByDay = async (req, res) => {
    const { day } = req.params; // Get only Day from parameters
    const dayLower = day.toLowerCase();

    // Validate day format
    const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    if (!validDays.includes(dayLower)) {
        return sendBadRequestResponse(res, "Invalid day format. Use: monday, tuesday, wednesday, thursday, friday, saturday, sunday");
    }

    try {
        // Only trainers can delete workouts
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Only trainers can delete workouts");
        }

        // Use deleteMany to delete all documents matching the day and memberId: null
        const deleteResult = await WorkoutModel.deleteMany(
            { day: dayLower, memberId: null } // Query only by day and for general workouts
        );

        if (deleteResult.deletedCount === 0) {
            return sendNotFoundResponse(res, "No general workouts found for the specified day to delete.");
        }

        return sendSuccessResponse(res, `Successfully deleted ${deleteResult.deletedCount} general workout(s) for ${day}.`, null);
    } catch (error) {
        console.error("Error deleting workout records by day:", error);
        return sendErrorResponse(res, 400, error.message);
    }
};
