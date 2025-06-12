import mongoose from "mongoose";

const dietSchema = new mongoose.Schema({
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
    breakfast: {
        type: String,
        required: true,
    },
    lunch: {
        type: String,
        required: true,
    },
    snack: {
        type: String,
        required: true,
    },
    dinner: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

// Create a compound unique index for day and memberId
dietSchema.index({ day: 1, memberId: 1 }, { unique: true });

export default mongoose.model("Diet", dietSchema);