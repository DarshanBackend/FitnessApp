import DietModel from '../models/dietModel.js';
import mongoose from 'mongoose';

// Add a new diet
export const adddiet = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            // If trainer, memberId should be provided in the request body
            if (!req.body.memberId) {
                return res.status(400).json({
                    message: "memberId is required for trainers to add diet plans for a member.",
                    details: "Please provide the member's ID in the request body"
                });
            }
            // Validate if the memberId is a valid ObjectId
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

        const newdiet = new DietModel({
            ...req.body,
            memberId: memberId
        });

        console.log('Creating new diet with data:', {
            day: newdiet.day,
            memberId: newdiet.memberId,
            breakfast: newdiet.breakfast,
            lunch: newdiet.lunch,
            snack: newdiet.snack,
            dinner: newdiet.dinner
        });

        const saveddiet = await newdiet.save();
        res.status(201).json(saveddiet);
    } catch (error) {
        console.error('Error in adddiet:', error);
        res.status(400).json({
            message: error.message,
            details: "Error occurred while creating diet plan"
        });
    }
};

// Get a single diet by ID
export const getdietById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid diet ID" });
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const diet = await DietModel.findOne(query);
        if (!diet) {
            return res.status(404).json({ message: "Diet not found or you do not have permission to view it." });
        }
        res.status(200).json(diet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all diets
export const getAlldiet = async (req, res) => {
    try {
        let query = {};
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
            console.log('Member query:', { memberId: req.trainer._id });
        }
        const diets = await DietModel.find(query);
        console.log('Found diets:', diets);

        if (!diets || diets.length === 0) {
            return res.status(200).json({
                message: "No Data Available!!",
                details: req.trainer.isAdmin ?
                    "No diet plans found in the system." :
                    "No diet plans found for this member."
            });
        }

        res.status(200).json(diets);
    } catch (error) {
        console.error('Error in getAlldiet:', error);
        res.status(500).json({
            message: error.message,
            details: "Error occurred while fetching diet plans"
        });
    }
};

// Get diet by day
export const getDietByDay = async (req, res) => {
    try {
        let query = { day: req.params.day };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const diet = await DietModel.findOne(query);
        if (!diet) {
            return res.status(404).json({ message: "Diet plan not found for this day or you do not have permission to view it." });
        }
        res.status(200).json(diet);
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

// Update a diet by ID
export const updatediet = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid diet ID" });
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const updateddiet = await DietModel.findOneAndUpdate(
            query,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updateddiet) {
            return res.status(404).json({ message: "Diet not found or you do not have permission to update it." });
        }
        res.status(200).json(updateddiet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a diet by ID
export const deletediet = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid diet ID" });
    }
    try {
        let query = { _id: req.params.id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }
        const deleteddiet = await DietModel.findOneAndDelete(
            query
        );
        if (!deleteddiet) {
            return res.status(404).json({ message: "Diet not found or you do not have permission to delete it." });
        }
        res.status(200).json({ message: "diet deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
