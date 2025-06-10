import MuscularStrengthModel from '../models/MuscularStrengthModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";


// Add a new muscularStrength
export const addmuscularStrength = async (req, res) => {
    try {
        const newmuscularStrength = new MuscularStrengthModel(req.body);
        const savedmuscularStrength = await newmuscularStrength.save();
        res.status(201).json(savedmuscularStrength);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single muscularStrength by ID
export const getmuscularStrengthById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Muscular Strength ID" });
    }
    try {
        const muscularStrength = await MuscularStrengthModel.findById(req.params.id);
        if (!muscularStrength) {
            return res.status(404).json({ message: "Muscular Strength not found" });
        }
        res.status(200).json(muscularStrength);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all muscularStrengths
export const getAllmuscularStrength = async (req, res) => {
    try {
        const muscularStrengths = await MuscularStrengthModel.find().sort({ createdAt: -1 });

        if (!muscularStrengths || muscularStrengths.length === 0) {
            return res.status(200).json({ message: "No any Muscular Strength found!!" });
        }

        const formattedmuscularStrengths = muscularStrengths.map((muscularStrength) => {
            return {
                ...muscularStrength._doc,
                formattedDate: dayjs(muscularStrength.createdAt).format("DD MMM YYYY"),
            };
        });

        res.status(200).json(formattedmuscularStrengths);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a muscularStrength by ID
export const updatemuscularStrength = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Muscular Strength ID" });
    }
    try {
        const updatedmuscularStrength = await MuscularStrengthModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedmuscularStrength) {
            return res.status(404).json({ message: "Muscular Strength not found" });
        }
        res.status(200).json(updatedmuscularStrength);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a muscularStrength by ID
export const deletemuscularStrength = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Muscular Strength ID" });
    }
    try {
        const deletedmuscularStrength = await MuscularStrengthModel.findByIdAndDelete(req.params.id);
        if (!deletedmuscularStrength) {
            return res.status(404).json({ message: "Muscular Strength not found" });
        }
        res.status(200).json({ message: "Muscular Strength deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
