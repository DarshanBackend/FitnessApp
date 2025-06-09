import jwt from "jsonwebtoken";
import registerModel from "../models/registerModel.js";
export const TrainerAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error("Token is not valid!!!");
        }

        const decodedObj = await jwt.verify(token, "Darshan@123");

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
