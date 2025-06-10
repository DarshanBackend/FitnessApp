import MuscularEnduranceCrunchModel from '../models/MuscularEnduranceCrunchModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";

// Add a new MuscularEnduranceCrunch
export const addMuscularEnduranceCrunch = async (req, res) => {
    try {
        const newMuscularEnduranceCrunch = new MuscularEnduranceCrunchModel(req.body);
        const savedMuscularEnduranceCrunch = await newMuscularEnduranceCrunch.save();
        res.status(201).json(savedMuscularEnduranceCrunch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single MuscularEnduranceCrunch by ID
export const getMuscularEnduranceCrunchById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Muscular Endurance Crunch ID" });
    }
    try {
        const MuscularEnduranceCrunch = await MuscularEnduranceCrunchModel.findById(req.params.id);
        if (!MuscularEnduranceCrunch) {
            return res.status(404).json({ message: "Muscular Endurance Crunch not found" });
        }
        res.status(200).json(MuscularEnduranceCrunch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all MuscularEnduranceCrunchs
export const getAllMuscularEnduranceCrunch = async (req, res) => {
    try {
        const MuscularEnduranceCrunchs = await MuscularEnduranceCrunchModel.find().sort({ createdAt: -1 });

        if (!MuscularEnduranceCrunchs || MuscularEnduranceCrunchs.length === 0) {
            return res.status(200).json({ message: "No any Muscular Endurance Crunch found!!" });
        }

        const formattedMuscularEnduranceCrunchs = MuscularEnduranceCrunchs.map((MuscularEnduranceCrunch) => {
            return {
                ...MuscularEnduranceCrunch._doc,
                formattedDate: dayjs(MuscularEnduranceCrunch.createdAt).format("DD MMM YYYY"),
            };
        });

        res.status(200).json(formattedMuscularEnduranceCrunchs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a MuscularEnduranceCrunch by ID
export const updateMuscularEnduranceCrunch = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Muscular Endurance Crunch ID" });
    }
    try {
        const updatedMuscularEnduranceCrunch = await MuscularEnduranceCrunchModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMuscularEnduranceCrunch) {
            return res.status(404).json({ message: "Muscular Endurance Crunch not found" });
        }
        res.status(200).json(updatedMuscularEnduranceCrunch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a MuscularEnduranceCrunch by ID
export const deleteMuscularEnduranceCrunch = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Muscular Endurance Crunch ID" });
    }
    try {
        const deletedMuscularEnduranceCrunch = await MuscularEnduranceCrunchModel.findByIdAndDelete(req.params.id);
        if (!deletedMuscularEnduranceCrunch) {
            return res.status(404).json({ message: "Muscular Endurance Crunch not found" });
        }
        res.status(200).json({ message: "Muscular Endurance Crunch deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
