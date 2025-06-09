import Register from "../models/registerModel.js";
import { ThrowError } from "../utils/ErrorUtils.js"
import bcrypt from "bcryptjs";
import fs from 'fs';
import path from "path";

// Create new trainer
export const createRegister = async (req, res) => {
    try {
        const { name, contact, email, birth_date, password, type } = req.body;

        // Validate required fields
        if (!name || !contact || !email || !birth_date || !password || !type) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate birth date format
        const birthDate = new Date(birth_date);
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({
                message: "Invalid birth date format. Please use YYYY-MM-DD format"
            });
        }

        // Check if email already exists
        const existingTrainer = await Register.findOne({ email });
        if (existingTrainer) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newRegister = await Register.create({
            name,
            contact,
            email,
            birth_date: birthDate,
            password: hashedPassword,
            type
        });

        res.status(201).json({
            message: "Registration successful",
            data: newRegister
        });
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

// Get single trainer by ID
export const getRegisterById = async (req, res) => {
    try {
        const { id } = req.params;

        const register = await Register.findById(id);

        if (!register) {
            return res.status(404).json({
                message: "Trainer not found"
            });
        }

        res.status(200).json({
            data: register
        });
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

// Get all trainers
export const getAllRegister = async (req, res) => {
    try {
        const registers = await Register.find();

        if (!registers || registers.length === 0) {
            return res.status(200).json({ message: "No any trainer found!!" })
        }

        return res.status(200).json({
            message: "Trainers fetched successfully",
            data: registers
        });

    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

// Update trainer
export const updateRegister = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact, birth_date } = req.body;

        // First check if trainer exists
        const existingTrainer = await Register.findById(id);
        if (!existingTrainer) {
            // If file was uploaded but trainer not found, delete the uploaded file
            if (req.file) {
                const filePath = path.resolve(req.file.path);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            return ThrowError(res, 404, "Trainer not found");
        }

        // If trainer exists, proceed with update
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
                return res.status(400).json({
                    message: "Invalid birth date format. Please use YYYY-MM-DD format"
                });
            }
            existingTrainer.birth_date = birthDate;
        }

        if (newImagePath) {
            // Delete old image if exists
            if (existingTrainer.trainer_image) {
                const oldImagePath = path.resolve(existingTrainer.trainer_image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            existingTrainer.trainer_image = newImagePath;
        }

        await existingTrainer.save();

        return res.status(200).json({
            message: "Trainer updated successfully",
            data: existingTrainer
        });
    } catch (error) {
        // If any error occurs and file was uploaded, delete it
        if (req.file) {
            const filePath = path.resolve(req.file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return ThrowError(res, 500, error.message)
    }
};

// Delete trainer
export const deleteRegister = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if Trainer exists
        const existingTrainer = await Register.findById(id);
        if (!existingTrainer) {
            return res.status(404).json({
                message: "Trainer not found"
            });
        }

        if (existingTrainer.trainer_image) {
            const imagePath = path.resolve(existingTrainer.trainer_image);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Register.findByIdAndDelete(id);

        res.status(200).json({
            message: "Trainer deleted successfully"
        });
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

