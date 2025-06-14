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

        let query = {};
        let responseMessage = `Workouts for ${dayLower} retrieved successfully`;

        if (!req.trainer.isAdmin) {
            // Member: Show their specific workouts and all general workouts
            query = { 
                day: dayLower,
                $or: [{ memberId: req.trainer._id }, { memberId: null }] 
            };
            responseMessage = `Your workouts for ${dayLower} retrieved successfully`;
        } else if (req.query.memberId) {
            // Trainer with memberId query: Show that member's specific workouts and all general workouts
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = { 
                day: dayLower,
                $or: [{ memberId: req.query.memberId }, { memberId: null }] 
            };
            responseMessage = `Workouts for member ${req.query.memberId} on ${dayLower} retrieved successfully`;
        } else {
            // Trainer without memberId query: Show all workouts for the day
            query = { day: dayLower };
        }

        const workouts = await WorkoutModel.find(query).sort({ createdAt: 1 });

        if (!workouts || workouts.length === 0) {
            return sendSuccessResponse(res, `No workouts found for ${dayLower}`, { [dayLower]: [] });
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
export const updateWorkoutById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Workout ID");
        }

        // Only trainers can update workouts
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Only trainers can update workouts");
        }

        // Find the workout first to check if it exists and get its details
        const workout = await WorkoutModel.findById(id);
        if (!workout) {
            return sendNotFoundResponse(res, "Workout not found");
        }

        // If day is being updated, validate the new day format
        if (req.body.day) {
            const dayLower = req.body.day.toLowerCase();
            const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
            if (!validDays.includes(dayLower)) {
                return sendBadRequestResponse(res, "Invalid day format. Use: monday, tuesday, wednesday, thursday, friday, saturday, sunday");
            }
            req.body.day = dayLower;
        }

        // Update the workout
        const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );

        // Group the updated workout by day for consistent response format
        const workoutsByDay = {
            [updatedWorkout.day]: [updatedWorkout]
        };

        const message = updatedWorkout.memberId 
            ? `Successfully updated member-specific workout for ${updatedWorkout.day}`
            : `Successfully updated general workout for ${updatedWorkout.day}`;

        return sendSuccessResponse(res, message, workoutsByDay);
    } catch (error) {
        console.error("Error updating workout record:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete a workout by ID (only trainers can delete)
export const deleteWorkoutById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Workout ID");
        }

        // Only trainers can delete workouts
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Only trainers can delete workouts");
        }

        // Find the workout first to check if it exists and get its details
        const workout = await WorkoutModel.findById(id);
        if (!workout) {
            return sendNotFoundResponse(res, "Workout not found");
        }

        // Delete the workout
        const deletedWorkout = await WorkoutModel.findByIdAndDelete(id);

        // Return success with details about what was deleted
        const message = workout.memberId 
            ? `Successfully deleted member-specific workout for ${workout.day}`
            : `Successfully deleted general workout for ${workout.day}`;

        return sendSuccessResponse(res, message);
    } catch (error) {
        console.error("Error deleting workout record:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};
