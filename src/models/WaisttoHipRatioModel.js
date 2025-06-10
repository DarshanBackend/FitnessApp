import mongoose from "mongoose";

const waisttoHipRatioSchema = mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
    },
    waist: {
        type: String,
        require: true
    },
    hip: {
        type: String,
        require: true
    },
}, {
    timestamps: true
})

export default mongoose.model("WaisttoHipRatio", waisttoHipRatioSchema)