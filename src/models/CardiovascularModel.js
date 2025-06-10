import mongoose from "mongoose";

const cardiovascularSchema = mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
    },
    mrh: {
        type: String,
        require: true
    },
    recover_heart_rate: {
        type: String,
        require: true
    },
    reference: {
        type: String,
        default: "-",
        require: true
    },
}, {
    timestamps: true
})

export default mongoose.model("Cardiovascular", cardiovascularSchema)