import FlexiblitiyModel from '../models/FlexiblitiyModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";

// Add a new Flexiblitiy
export const addFlexiblitiy = async (req, res) => {
    try {
        const newFlexiblitiy = new FlexiblitiyModel(req.body);
        const savedFlexiblitiy = await newFlexiblitiy.save();
        res.status(201).json(savedFlexiblitiy);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single Flexiblitiy by ID
export const getFlexiblitiyById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Flexibility ID" });
    }
    try {
        const Flexiblitiy = await FlexiblitiyModel.findById(req.params.id);
        if (!Flexiblitiy) {
            return res.status(404).json({ message: "Flexibility not found" });
        }
        res.status(200).json(Flexiblitiy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all Flexiblitiys
export const getAllFlexiblitiy = async (req, res) => {
    try {
        const Flexiblitiys = await FlexiblitiyModel.find().sort({ createdAt: -1 });

        if (!Flexiblitiys || Flexiblitiys.length === 0) {
            return res.status(200).json({ message: "No any Flexibility found!!" });
        }

        const formattedFlexiblitiys = Flexiblitiys.map((Flexiblitiy) => {
            return {
                ...Flexiblitiy._doc,
                formattedDate: dayjs(Flexiblitiy.createdAt).format("DD MMM YYYY"),
            };
        });

        res.status(200).json(formattedFlexiblitiys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Flexiblitiy by ID
export const updateFlexiblitiy = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Flexibility ID" });
    }
    try {
        const updatedFlexiblitiy = await FlexiblitiyModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFlexiblitiy) {
            return res.status(404).json({ message: "Flexibility not found" });
        }
        res.status(200).json(updatedFlexiblitiy);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Flexiblitiy by ID
export const deleteFlexiblitiy = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Flexibility ID" });
    }
    try {
        const deletedFlexiblitiy = await FlexiblitiyModel.findByIdAndDelete(req.params.id);
        if (!deletedFlexiblitiy) {
            return res.status(404).json({ message: "Flexibility not found" });
        }
        res.status(200).json({ message: "Flexibility deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};