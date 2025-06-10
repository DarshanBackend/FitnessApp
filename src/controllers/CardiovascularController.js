import CardiovascularModel from '../models/CardiovascularModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";

// Add a new Cardiovascular
export const addCardiovascular = async (req, res) => {
    try {
        const newCardiovascular = new CardiovascularModel(req.body);
        const savedCardiovascular = await newCardiovascular.save();
        res.status(201).json(savedCardiovascular);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single Cardiovascular by ID
export const getCardiovascularById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Cardiovascular ID" });
    }
    try {
        const Cardiovascular = await CardiovascularModel.findById(req.params.id);
        if (!Cardiovascular) {
            return res.status(404).json({ message: "Cardiovascular not found" });
        }
        res.status(200).json(Cardiovascular);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all Cardiovasculars
export const getAllCardiovascular = async (req, res) => {
    try {
        const Cardiovasculars = await CardiovascularModel.find().sort({ createdAt: -1 });

        if (!Cardiovasculars || Cardiovasculars.length === 0) {
            return res.status(200).json({ message: "No any Cardiovascular found!!" });
        }

        const formattedCardiovasculars = Cardiovasculars.map((Cardiovascular) => {
            return {
                ...Cardiovascular._doc,
                formattedDate: dayjs(Cardiovascular.createdAt).format("DD MMM YYYY"),
            };
        });

        res.status(200).json(formattedCardiovasculars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Cardiovascular by ID
export const updateCardiovascular = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Cardiovascular ID" });
    }
    try {
        const updatedCardiovascular = await CardiovascularModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCardiovascular) {
            return res.status(404).json({ message: "Cardiovascular not found" });
        }
        res.status(200).json(updatedCardiovascular);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Cardiovascular by ID
export const deleteCardiovascular = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Cardiovascular ID" });
    }
    try {
        const deletedCardiovascular = await CardiovascularModel.findByIdAndDelete(req.params.id);
        if (!deletedCardiovascular) {
            return res.status(404).json({ message: "Cardiovascular not found" });
        }
        res.status(200).json({ message: "Cardiovascular deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
