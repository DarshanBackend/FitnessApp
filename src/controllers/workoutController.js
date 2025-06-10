import WorkoutModel from '../models/workoutModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";

// Add a new workout
export const addWorkout = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            if (!req.body.memberId) {
                return res.status(400).json({
                    message: "memberId is required for trainers to add workout data for a member.",
                    details: "Please provide the member's ID in the request body"
                });
            }

            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return res.status(400).json({
                    message: "Invalid memberId format",
                    details: "The provided memberId is not a valid MongoDB ObjectId"
                });
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
        res.status(201).json(savedWorkout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single workout by ID
export const getWorkoutById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Workout ID" });
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const workout = await WorkoutModel.findOne(query);
        if (!workout) {
            return res.status(404).json({ message: "Workout not found or you do not have permission to view it." });
        }
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            return res.status(200).json({ message: "No any workout found!!" });
        }

        const formattedWorkouts = workouts.map((workout) => {
            return {
                ...workout._doc,
                formattedDate: dayjs(workout.createdAt).format("DD MMM YYYY"),
            };
        });

        res.status(200).json(formattedWorkouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a workout by ID
export const updateWorkout = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Workout ID" });
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
            return res.status(404).json({ message: "Workout not found or you do not have permission to update it." });
        }
        res.status(200).json(updatedWorkout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a workout by ID
export const deleteWorkout = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Workout ID" });
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const deletedWorkout = await WorkoutModel.findOneAndDelete(
            query
        );
        if (!deletedWorkout) {
            return res.status(404).json({ message: "Workout not found or you do not have permission to delete it." });
        }
        res.status(200).json({ message: "Workout deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 