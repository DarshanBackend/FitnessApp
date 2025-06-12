import jwt from "jsonwebtoken";
import registerModel from "../models/registerModel.js";
import { sendErrorResponse, sendForbiddenResponse, sendUnauthorizedResponse } from '../utils/ResponseUtils.js';

export const TrainerAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return sendUnauthorizedResponse(res, "Token is not valid");
        }

        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET || "Darshan@123"); 

        const { _id } = decodedObj;

        const trainer = await registerModel.findById(_id);

        if (!trainer) {
            return sendNotFoundResponse(res, "Trainer not found");
        }

        req.trainer = trainer;
        next();
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        // Assuming TrainerAuth has already run and set req.trainer
        if (!req.trainer || !req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Not an admin/trainer.");
        }
        next();
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const isMember = async (req, res, next) => {
    try {
        // Assuming TrainerAuth has already run and set req.trainer (which can be a member here)
        if (!req.trainer) {
            return sendUnauthorizedResponse(res, "Authentication required");
        }
        // If isAdmin is false, it's a member or default member
        if (req.trainer.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Not a member.");
        }
        next();
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};
