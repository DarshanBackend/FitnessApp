import WorkoutModel from '../models/workoutModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';

// Add a new workout
export const addWorkout = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add workout data for a member.");
            }

            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }

        const newWorkout = new WorkoutModel({
            ...req.body,
            memberId: memberId
        });
        const savedWorkout = await newWorkout.save();
        return sendCreatedResponse(res, "Workout added successfully", savedWorkout);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single workout by ID
export const getWorkoutById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Workout ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const workout = await WorkoutModel.findOne(query);
        if (!workout) {
            return sendNotFoundResponse(res, "Workout not found or you do not have permission to view it.");
        }
        return sendSuccessResponse(res, "Workout retrieved successfully", workout);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all workouts
export const getAllWorkout = async (req, res) => {
    try {
        let query = {};
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const workouts = await WorkoutModel.find(query).sort({ createdAt: -1 });

        if (!workouts || workouts.length === 0) {
            return sendSuccessResponse(res, "No workouts found", []);
        }

        const formattedWorkouts = workouts.map((workout) => {
            return {
                ...workout._doc,
                formattedDate: dayjs(workout.createdAt).format("DD MMM YYYY"),
            };
        });

        return sendSuccessResponse(res, "Workouts retrieved successfully", formattedWorkouts);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a workout by ID
export const updateWorkout = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Workout ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const updatedWorkout = await WorkoutModel.findOneAndUpdate(
            query,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedWorkout) {
            return sendNotFoundResponse(res, "Workout not found or you do not have permission to update it.");
        }
        return sendSuccessResponse(res, "Workout updated successfully", updatedWorkout);
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

// Delete a workout by ID
export const deleteWorkout = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendBadRequestResponse(res, "Invalid Workout ID");
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const deletedWorkout = await WorkoutModel.findOneAndDelete(query);
        if (!deletedWorkout) {
            return sendNotFoundResponse(res, "Workout not found or you do not have permission to delete it.");
        }
        return sendSuccessResponse(res, "Workout deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
}; 