import MuscularEndurancePushUPModel from '../models/MuscularEndurancePushUPModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";


// Add a new MuscularEndurancePushUP
export const addMuscularEndurancePushUP = async (req, res) => {
    try {
        const newMuscularEndurancePushUP = new MuscularEndurancePushUPModel(req.body);
        const savedMuscularEndurancePushUP = await newMuscularEndurancePushUP.save();
        res.status(201).json(savedMuscularEndurancePushUP);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single MuscularEndurancePushUP by ID
export const getMuscularEndurancePushUPById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Muscular Endurance Push UP ID" });
    }
    try {
        const MuscularEndurancePushUP = await MuscularEndurancePushUPModel.findById(req.params.id);
        if (!MuscularEndurancePushUP) {
            return res.status(404).json({ message: "Muscular Endurance Push UP not found" });
        }
        res.status(200).json(MuscularEndurancePushUP);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all MuscularEndurancePushUPs
export const getAllMuscularEndurancePushUP = async (req, res) => {
    try {
        const MuscularEndurancePushUPs = await MuscularEndurancePushUPModel.find().sort({ createdAt: -1 });

        if (!MuscularEndurancePushUPs || MuscularEndurancePushUPs.length === 0) {
            return res.status(200).json({ message: "No any Muscular Endurance Push UP found!!" });
        }

        const formattedMuscularEndurancePushUPs = MuscularEndurancePushUPs.map((MuscularEndurancePushUP) => {
            return {
                ...MuscularEndurancePushUP._doc,
                formattedDate: dayjs(MuscularEndurancePushUP.createdAt).format("DD MMM YYYY"),
            };
        });

        res.status(200).json(formattedMuscularEndurancePushUPs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a MuscularEndurancePushUP by ID
export const updateMuscularEndurancePushUP = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Muscular Endurance Push UP ID" });
    }
    try {
        const updatedMuscularEndurancePushUP = await MuscularEndurancePushUPModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMuscularEndurancePushUP) {
            return res.status(404).json({ message: "Muscular Endurance Push UP not found" });
        }
        res.status(200).json(updatedMuscularEndurancePushUP);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a MuscularEndurancePushUP by ID
export const deleteMuscularEndurancePushUP = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Muscular Endurance Push UP ID" });
    }
    try {
        const deletedMuscularEndurancePushUP = await MuscularEndurancePushUPModel.findByIdAndDelete(req.params.id);
        if (!deletedMuscularEndurancePushUP) {
            return res.status(404).json({ message: "Muscular Endurance Push UP not found" });
        }
        res.status(200).json({ message: "Muscular Endurance Push UP deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
