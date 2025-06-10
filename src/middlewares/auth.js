import jwt from "jsonwebtoken";
import registerModel from "../models/registerModel.js";

export const TrainerAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Token is not valid!!!");
        }

        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET || "Darshan@123"); 

        const { _id } = decodedObj;

        const trainer = await registerModel.findById(_id);

        if (!trainer) {
            throw new Error("Trainer not Found!!!");
        }

        req.trainer = trainer;
        next();
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        // Assuming TrainerAuth has already run and set req.trainer
        if (!req.trainer || !req.trainer.isAdmin) {
            return res.status(403).json({ message: "Access denied. Not an admin/trainer." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isMember = async (req, res, next) => {
    try {
        // Assuming TrainerAuth has already run and set req.trainer (which can be a member here)
        if (!req.trainer) {
            return res.status(401).json({ message: "Authentication required." });
        }
        // If isAdmin is false, it's a member or default member
        if (req.trainer.isAdmin) {
            return res.status(403).json({ message: "Access denied. Not a member." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
