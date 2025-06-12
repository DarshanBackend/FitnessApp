import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Approved", "Rejected", "Pending"],
        default: "Pending",
    },
}, {
    timestamps: true
});

export default mongoose.model("Leave", leaveSchema); 