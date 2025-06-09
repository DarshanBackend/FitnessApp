import Register from "../models/registerModel.js";
import { ThrowError } from "../utils/ErrorUtils.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const loginTrainer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Search trainer by email
        const trainer = await Register.findOne({ email: email.toLowerCase() });
        if (!trainer) {
            return res.status(404).json({ message: "trainer not found" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, trainer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = await trainer.getJWT();
        if (!token) {
            return res.status(500).json({ message: "Failed to generate token" });
        }


        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 8 * 3600000), // 8 hours
        });

        // Send success response
        return res.status(200).json({
            message: "Login successful",
            trainer: {
                id: trainer._id,
                name: trainer.name,
                email: trainer.email,
                type: trainer.type
            },
        });

    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

//forgot password
export const forgottrainerPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Provide Email Id" });
        }

        const trainer = await Register.findOne({ email: email })
        if (!trainer) {
            return res.status(400).json({ message: "Trainer Not Found" });
        }

        const otp = generateOTP();
        trainer.resetOTP = otp;
        trainer.otpExpires = Date.now() + 10 * 60 * 1000; // valid 10 minutes
        await trainer.save();

        // Nodemailer setup
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MY_GMAIL,
                pass: process.env.MY_PASSWORD,
            },
            tls: { rejectUnauthorized: false },
        });

        const mailOptions = {
            from: process.env.MY_GMAIL,
            to: email,
            subject: "trainer Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "OTP sent successfully to your email." });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

//Verify Email
export const VerifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res
                .status(400)
                .json({ message: "Please provide email and OTP." });
        }

        const trainer = await Register.findOne({ email: email });
        if (!trainer) {
            return res.status(404).json({ message: "trainer not found." });
        }

        // Validate OTP
        if (trainer.resetOTP !== otp || trainer.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        await trainer.save();

        return res.status(200).json({
            message: "OTP Submitted successfully."
        });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Reset Password using OTP
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        if (!newPassword || !confirmPassword) {
            return res
                .status(400)
                .json({ message: "Please provide email , newpassword and confirmpassword." });
        }

        const trainer = await Register.findOne({ email: email });
        if (!trainer) {
            return res.status(400).json({ message: "trainer Not Found" });
        }

        if (!(newPassword === confirmPassword)) {
            return res
                .status(400)
                .json({ message: "Please check newpassword and confirmpassword." });
        }

        // Hash new password
        await Register.findOne({ password: newPassword });
        trainer.password = await bcrypt.hash(newPassword, 10);
        trainer.resetOTP = undefined;
        trainer.otpExpires = undefined;
        await trainer.save();

        return res.status(200).json({
            message: "Password reset successfully.",
            trainer: { id: trainer._id, email: trainer.email },
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Change Password for trainer
export const changetrainerPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "oldPassword, newPassword, and confirmPassword are required."
            });
        }

        const trainer = await Register.findById(id);
        if (!trainer) {
            return res.status(404).json({
                message: "Trainer not found with the provided ID"
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, trainer.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        if (newPassword === oldPassword) {
            return res.status(400).json({
                message: "New password cannot be the same as current password."
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New password and confirm password do not match."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        trainer.password = hashedPassword;
        await trainer.save();

        return res.status(200).json({ message: "Password changed successfully." });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

//logoutTrainer
export const logoutTrainer = async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) });

        res.send("Trainer logout successfully...✅");
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
};