import Vo2MaxRockPortTestModel from '../models/Vo2MaxRockPortTestModel.js';
import mongoose from 'mongoose';
import dayjs from "dayjs";


// Add a new vo2MaxRockPortTest
export const addvo2MaxRockPortTest = async (req, res) => {
    try {
        const newvo2MaxRockPortTest = new Vo2MaxRockPortTestModel(req.body);
        const savedvo2MaxRockPortTest = await newvo2MaxRockPortTest.save();
        res.status(201).json(savedvo2MaxRockPortTest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single vo2MaxRockPortTest by ID
export const getvo2MaxRockPortTestById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid VO2 Max Rock Port Test ID" });
    }
    try {
        const vo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findById(req.params.id);
        if (!vo2MaxRockPortTest) {
            return res.status(404).json({ message: "VO2 Max Rock Port Test not found" });
        }
        res.status(200).json(vo2MaxRockPortTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all vo2MaxRockPortTests
export const getAllvo2MaxRockPortTest = async (req, res) => {
    try {
        const vo2MaxRockPortTests = await Vo2MaxRockPortTestModel.find().sort({ createdAt: -1 });

        if (!vo2MaxRockPortTests || vo2MaxRockPortTests.length === 0) {
            return res.status(200).json({ message: "No any VO2 Max Rock Port Test found!!" });
        }

        const formattedvo2MaxRockPortTests = vo2MaxRockPortTests.map((vo2MaxRockPortTest) => {
            return {
                ...vo2MaxRockPortTest._doc,
                formattedDate: dayjs(vo2MaxRockPortTest.createdAt).format("DD MMM YYYY"),
            };
        });

        res.status(200).json(formattedvo2MaxRockPortTests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a vo2MaxRockPortTest by ID
export const updatevo2MaxRockPortTest = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid VO2 Max Rock Port Test ID" });
    }
    try {
        const updatedvo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedvo2MaxRockPortTest) {
            return res.status(404).json({ message: "VO2 Max Rock Port Test not found" });
        }
        res.status(200).json(updatedvo2MaxRockPortTest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a vo2MaxRockPortTest by ID
export const deletevo2MaxRockPortTest = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid VO2 Max Rock Port Test ID" });
    }
    try {
        const deletedvo2MaxRockPortTest = await Vo2MaxRockPortTestModel.findByIdAndDelete(req.params.id);
        if (!deletedvo2MaxRockPortTest) {
            return res.status(404).json({ message: "VO2 Max Rock Port Test not found" });
        }
        res.status(200).json({ message: "VO2 Max Rock Port Test deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
