import DietModel from '../models/dietModel.js';
import mongoose from 'mongoose';
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Add a new diet
export const adddiet = async (req, res) => {
    try {
        let memberId;
        if (req.trainer.isAdmin) {
            // If trainer, memberId should be provided in the request body
            if (!req.body.memberId) {
                return sendBadRequestResponse(res, "memberId is required for trainers to add diet plans for a member.");
            }
            // Validate if the memberId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(req.body.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format");
            }
            memberId = req.body.memberId;
        } else {
            memberId = req.trainer._id;
        }

        // Validate required fields
        if (!req.body.day || !req.body.breakfast || !req.body.lunch || !req.body.snack || !req.body.dinner) {
            return sendBadRequestResponse(res, "All fields (day, breakfast, lunch, snack, dinner) are required");
        }

        // Convert day to lowercase
        const dayLower = req.body.day.toLowerCase();


        const newdiet = new DietModel({
            ...req.body,
            day: dayLower,



            
            memberId: memberId
        });

        const saveddiet = await newdiet.save();

        return sendCreatedResponse(res, "Diet plan added successfully", saveddiet);
    } catch (error) {
        console.error('Error adding diet plan:', error);
        return sendErrorResponse(res, 400, error.message);
    }
};

// Get a single diet by ID
export const getdietById = async (req, res) => {
    try {
        let memberId;
        if (!req.trainer.isAdmin) {
            // Member: can only see their own data
            memberId = req.trainer._id;
        } else if (req.params.id) {
            // Trainer: must provide memberId in params
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return sendBadRequestResponse(res, "Invalid memberId format in params");
            }
            memberId = req.params.id;
        } else if (req.query.memberId) {
            // Trainer: can also provide memberId as query param
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            memberId = req.query.memberId;
        } else {
            // Trainer without memberId: not allowed
            return sendBadRequestResponse(res, "Trainers must provide a memberId parameter to view a member's diet.");
        }

        // Find all diets for the member
        const diets = await DietModel.find({ memberId }).sort({ day: 1, createdAt: 1 });

        if (!diets || diets.length === 0) {
            return sendNotFoundResponse(res, "Diet plan not found");
        }

        // Group diets by day for structured response
        const dietsByDay = diets.reduce((acc, diet) => {
            const day = diet.day;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(diet);
            return acc;
        }, {});

        return sendSuccessResponse(res, "Diet plan(s) retrieved successfully", dietsByDay);
    } catch (error) {
        console.error('Error getting diet plan:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all diets
export const getAlldiet = async (req, res) => {
    try {
        let query = {};
        let responseMessage = "All diet plans retrieved successfully";

        if (!req.trainer.isAdmin) {
            // Member: Show their specific diet plans
            query = { memberId: req.trainer._id };
            responseMessage = "Your diet plans retrieved successfully";
        } else if (req.query.memberId) {
            // Trainer with memberId query: Show that member's specific diet plans
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = { memberId: req.query.memberId };
            responseMessage = `Diet plans for member ${req.query.memberId} retrieved successfully`;
        } else {
            // Trainer without memberId query: Show all diet plans
            query = {};
        }

        const diets = await DietModel.find(query).sort({ day: 1, createdAt: 1 });

        if (!diets || diets.length === 0) {
            return sendSuccessResponse(res, "No diet plans found", []);
        }

        // Group diets by day for structured response
        const dietsByDay = diets.reduce((acc, diet) => {
            const day = diet.day;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(diet);
            return acc;
        }, {});

        return sendSuccessResponse(res, responseMessage, dietsByDay);
    } catch (error) {
        console.error('Error getting all diet plans:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get diet by day (for members and trainers)
export const getDietByDay = async (req, res) => {
    try {
        const { day } = req.params;
        const dayLower = day.toLowerCase();

        // Validate day format
        const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        if (!validDays.includes(dayLower)) {
            return sendBadRequestResponse(res, "Invalid day format. Use: monday, tuesday, wednesday, thursday, friday, saturday, sunday");
        }

        let query = {};
        let responseMessage = `Diet plans for ${dayLower} retrieved successfully`;

        if (!req.trainer.isAdmin) {
            // Member: Show only their specific diet for the day
            query = {
                day: dayLower,
                memberId: req.trainer._id
            };
            responseMessage = `Your diet plans for ${dayLower} retrieved successfully`;
        } else if (req.query.memberId) {
            // Trainer: Must provide memberId, show only that member's diet for the day
            if (!mongoose.Types.ObjectId.isValid(req.query.memberId)) {
                return sendBadRequestResponse(res, "Invalid memberId format in query");
            }
            query = {
                day: dayLower,
                memberId: req.query.memberId
            };
            responseMessage = `Diet plans for member ${req.query.memberId} on ${dayLower} retrieved successfully`;
        } else {
            // Trainer without memberId query: Not allowed
            return sendBadRequestResponse(res, "Trainers must provide a memberId query parameter to view a member's diet by day.");
        }

        const diets = await DietModel.find(query).sort({ createdAt: 1 });

        if (!diets || diets.length === 0) {
            return sendSuccessResponse(res, `No diet plans found for ${dayLower}`, { [dayLower]: [] });
        }

        // Group diets by day for structured response
        const dietsByDay = diets.reduce((acc, diet) => {
            const day = diet.day;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(diet);
            return acc;
        }, {});

        return sendSuccessResponse(res, responseMessage, dietsByDay);
    } catch (error) {
        console.error("Error getting diet plans by day:", error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Update a diet by ID
export const updatediet = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid diet plan ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }

        const updateddiet = await DietModel.findOneAndUpdate(
            query,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updateddiet) {
            return sendNotFoundResponse(res, "Diet plan not found or you do not have permission to update it");
        }

        return sendSuccessResponse(res, "Diet plan updated successfully", updateddiet);
    } catch (error) {
        console.error('Error updating diet plan:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Delete a diet by ID
export const deletediet = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid diet plan ID");
        }

        let query = { _id: id };
        if (!req.trainer.isAdmin) {
            query.memberId = req.trainer._id;
        }


        const deleteddiet = await DietModel.findOneAndDelete(query);

        if (!deleteddiet) {
            return sendNotFoundResponse(res, "Diet plan not found or you do not have permission to delete it");
        }

        return sendSuccessResponse(res, "Diet plan deleted successfully");
    } catch (error) {
        console.error('Error deleting diet plan:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};

// Get all diets for a specific member (trainer only)
export const getDietsForMemberByTrainer = async (req, res) => {
    try {
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Only trainers can access this endpoint.");
        }
        const { memberId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(memberId)) {
            return sendBadRequestResponse(res, "Invalid memberId format");
        }
        const diets = await DietModel.find({ memberId }).sort({ day: 1, createdAt: 1 });
        if (!diets || diets.length === 0) {
            return sendSuccessResponse(res, "No diet plans found for this member", []);
        }
        // Group diets by day for structured response
        const dietsByDay = diets.reduce((acc, diet) => {
            const day = diet.day;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(diet);
            return acc;
        }, {});
        return sendSuccessResponse(res, `Diet plans for member ${memberId} retrieved successfully`, dietsByDay);
    } catch (error) {
        console.error('Error getting diets for member by trainer:', error);
        return sendErrorResponse(res, 500, error.message);
    }
};
