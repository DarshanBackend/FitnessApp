import Register from "../models/registerModel.js";
import { ThrowError } from "../utils/ErrorUtils.js"
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer"

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await Register.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = await user.getJWT();
        if (!token) {
            return res.status(500).json({ message: "Failed to generate token" });
        }

        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 8 * 3600000), // 8 hours
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                type: user.type
            },
        });

    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

//forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Provide Email Id" });
        }

        const user = await Register.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        const otp = generateOTP();
        user.resetOTP = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // valid 10 minutes
        await user.save();

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
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`, // Changed from trainer Password Reset OTP
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

        const user = await Register.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.resetOTP !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        await user.save();

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

        const user = await Register.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        if (!(newPassword === confirmPassword)) {
            return res
                .status(400)
                .json({ message: "Please check newpassword and confirmpassword." });
        }

        await Register.findOne({ password: newPassword });
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOTP = undefined;
        user.otpExpires = undefined;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully.",
            user: { id: user._id, email: user.email },
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Change Password for user
export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "oldPassword, newPassword, and confirmPassword are required."
            });
        }

        const user = await Register.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found with the provided ID"
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
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
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully." });

    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

//logoutUser
export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) });

        res.send("User logout successfully...✅");
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
};