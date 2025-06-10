import Register from "../models/registerModel.js";
import { ThrowError } from "../utils/ErrorUtils.js"
import bcrypt from "bcryptjs";
import fs from 'fs';
import path from "path";

// Create new user
export const createRegister = async (req, res) => {
    try {
        const { name, contact, email, birth_date, password, type } = req.body;

        if (!name || !contact || !email || !birth_date || !password || !type) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const birthDate = new Date(birth_date);
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({
                message: "Invalid birth date format. Please use YYYY-MM-DD format"
            });
        }

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
            type,
            isAdmin: type === 'trainer'
        });

        res.status(201).json({
            message: "Registration successful",
            data: newRegister
        });
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
            return res.status(403).json({ message: "Access denied. You can only view your own profile." });
        }

        const register = await Register.findOne(query);

        if (!register) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.status(200).json({
            data: register
        });
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

// Get all users
export const getAllRegister = async (req, res) => {
    try {
        let query = {};
        if (!req.trainer.isAdmin) {
            return res.status(403).json({ message: "Access denied. Only trainers can view all members." });
        }
        const registers = await Register.find(query);

        if (!registers || registers.length === 0) {
            return res.status(200).json({ message: "No any member found!!" })
        }

        return res.status(200).json({
            message: "Members fetched successfully",
            data: registers
        });

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
            return res.status(403).json({ message: "Access denied. You can only update your own profile." });
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
                return res.status(400).json({
                    message: "Invalid birth date format. Please use YYYY-MM-DD format"
                });
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

        return res.status(200).json({
            message: "Member updated successfully",
            data: existingTrainer
        });
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
            return res.status(404).json({
                message: "Member not found"
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
            message: "Member deleted successfully"
        });
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

