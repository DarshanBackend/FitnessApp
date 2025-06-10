import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    },
    videoTitle: {
        type: String,
        required: true,
    },
    videoURL: {
        type: String,
        required: true,
    },
    setsMinutes: {
        type: String,
        required: true,
    },
    repeats: {
        type: String,
        required: true,
    },
    minimumWeight: {
        type: String,
        required: false, 
    },
}, {
    timestamps: true
});

export default mongoose.model("Workout", workoutSchema); 