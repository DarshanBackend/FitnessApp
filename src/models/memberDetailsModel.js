import mongoose from "mongoose";

const memberDetailsSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true, unique: true },
    member_startDate: { type: String },
    member_endDate: { type: String },
    member_status: { type: String },
    member_month: { type: Number, default: 12 },
    member_goal: { type: String, default: "Fitness" },
    goal_status: { type: String, default: "Completed" },
    member_due: { type: Number, default: 0 }
});

export default mongoose.model("MemberDetails", memberDetailsSchema);
