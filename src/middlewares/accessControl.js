import { sendForbiddenResponse, sendUnauthorizedResponse } from '../utils/ResponseUtils.js';
import Register from '../models/registerModel.js';

// Middleware to check if the user has access to the requested member's data
export const checkMemberAccess = async (req, res, next) => {
    try {
        // If user is not authenticated
        if (!req.trainer) {
            return sendUnauthorizedResponse(res, "Authentication required");
        }

        // If user is a trainer (isAdmin), they have full access to all member data.
        // The specific filtering by memberId will be handled in the controller if needed.
        if (req.trainer.isAdmin) {
            req.member = req.trainer; // Set req.member to the trainer's info (for consistency, as they can access all)
            return next();
        }

        // If user is a member
        // Members can only access their own data. If an ID is provided in params, it must match their own ID.
        if (req.params.id && req.trainer._id.toString() !== req.params.id) {
            return sendForbiddenResponse(res, "Access denied. You can only access your own data.");
        }

        // If no ID is provided, or if the ID matches the member's own ID, allow access to their own data.
        req.member = req.trainer;
        next();
    } catch (error) {
        console.error("Error in checkMemberAccess middleware:", error);
        return sendForbiddenResponse(res, "Error checking access permissions");
    }
};

// Middleware to check if the user has access to the requested trainer's data
export const checkTrainerAccess = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // If user is not authenticated
        if (!req.trainer) {
            return sendUnauthorizedResponse(res, "Authentication required");
        }

        // If user is a trainer (isAdmin)
        if (req.trainer.isAdmin) {
            // Check if the trainer exists
            const trainer = await Register.findOne({ _id: id, type: 'trainer' });
            if (!trainer) {
                return sendForbiddenResponse(res, "Trainer not found");
            }
            // Trainers can access any trainer's data
            req.targetTrainer = trainer;
            return next();
        }

        // If user is a member
        if (req.trainer._id.toString() !== id) {
            return sendForbiddenResponse(res, "Access denied. You can only access your own data.");
        }

        // Member can access their own data
        req.targetTrainer = req.trainer;
        next();
    } catch (error) {
        return sendForbiddenResponse(res, "Error checking access permissions");
    }
}; 