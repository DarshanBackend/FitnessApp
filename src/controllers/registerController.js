import Register from "../models/registerModel.js";
import { ThrowError } from "../utils/ErrorUtils.js"
import bcrypt from "bcryptjs";
import fs from 'fs';
import path from "path";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendForbiddenResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';

// Create new user
export const createRegister = async (req, res) => {
    try {
        const { name, contact, email, birth_date, password, type } = req.body;

        if (!name || !contact || !email || !birth_date || !password || !type) {
            return sendBadRequestResponse(res, "All fields are required");
        }

        const birthDate = new Date(birth_date);
        if (isNaN(birthDate.getTime())) {
            return sendBadRequestResponse(res, "Invalid birth date format. Please use YYYY-MM-DD format");
        }

        const existingTrainer = await Register.findOne({ email });
        if (existingTrainer) {
            return sendBadRequestResponse(res, "Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newRegister = await Register.create({
            name,
            contact,
            email,
            birth_date: birthDate,
            password: hashedPassword,
            type,
            isAdmin: type === 'trainer'
        });

        return sendCreatedResponse(res, "Registration successful", newRegister);
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

// Get single user by ID
export const getRegisterById = async (req, res) => {
    try {
        const { id } = req.params;

        let query = { _id: id };
        if (!req.trainer.isAdmin && req.trainer._id.toString() !== id) {
            return sendForbiddenResponse(res, "Access denied. You can only view your own profile.");
        }

        const register = await Register.findOne(query);

        if (!register) {
            return sendErrorResponse(res, 404, "Member not found");
        }

        return sendSuccessResponse(res, "Member retrieved successfully", register);
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

// Get all users
export const getAllRegister = async (req, res) => {
    try {
        let query = {};
        if (!req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Only trainers can view all members.");
        }
        const registers = await Register.find(query);

        if (!registers || registers.length === 0) {
            return sendSuccessResponse(res, "No members found", []);
        }

        return sendSuccessResponse(res, "Members fetched successfully", registers);

    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

// Update user
export const updateRegister = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact, birth_date } = req.body;

        if (!req.trainer.isAdmin && req.trainer._id.toString() !== id) {
            return sendForbiddenResponse(res, "Access denied. You can only update your own profile.");
        }

        const existingTrainer = await Register.findById(id);
        if (!existingTrainer) {
            if (req.file) {
                const filePath = path.resolve(req.file.path);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            return ThrowError(res, 404, "Member not found");
        }

        const newImagePath = req.file?.path;

        if (name) {
            existingTrainer.name = name;
        }
        if (contact) {
            existingTrainer.contact = contact;
        }
        if (birth_date) {
            const birthDate = new Date(birth_date);
            if (isNaN(birthDate.getTime())) {
                if (req.file) {
                    const filePath = path.resolve(req.file.path);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
                return sendBadRequestResponse(res, "Invalid birth date format. Please use YYYY-MM-DD format");
            }
            existingTrainer.birth_date = birthDate;
        }

        if (newImagePath) {
            if (existingTrainer.trainer_image) {
                const oldImagePath = path.resolve(existingTrainer.trainer_image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            existingTrainer.trainer_image = newImagePath;
        }

        await existingTrainer.save();

        return sendSuccessResponse(res, "Member updated successfully", existingTrainer);
    } catch (error) {
        if (req.file) {
            const filePath = path.resolve(req.file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return ThrowError(res, 500, error.message)
    }
};

// Delete user
export const deleteRegister = async (req, res) => {
    try {
        const { id } = req.params;

        const existingTrainer = await Register.findById(id);
        if (!existingTrainer) {
            return sendErrorResponse(res, 404, "Member not found");
        }

        if (existingTrainer.trainer_image) {
            const imagePath = path.resolve(existingTrainer.trainer_image);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Register.findByIdAndDelete(id);

        return sendSuccessResponse(res, "Member deleted successfully");
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};


export const getAllMembers = async (req, res) => {
    try {
        // --- Access Control: Only allow trainers to view all members ---
        if (!req.trainer.isAdmin) {
            // If the logged-in user is NOT an admin (i.e., they are a member),
            // they are forbidden from accessing this list.
            return sendForbiddenResponse(res, "Access denied. Only trainers can view all members.");
        }
        // ---------------------------------------------------------------

        // Find all users where the 'type' field is 'member'
        const members = await Register.find({ type: 'member' });

        // Check if any members were found
        if (!members || members.length === 0) {
            return sendSuccessResponse(res, "No members found", []);
        }

        // Send a success response with the fetched members
        return sendSuccessResponse(res, "Members fetched successfully", members);

    } catch (error) {
        // Handle any errors that occur during the process
        // (e.g., database connection issues, server errors)
        return ThrowError(res, 500, error.message)
    }
};