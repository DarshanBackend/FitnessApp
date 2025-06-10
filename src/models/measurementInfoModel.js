import mongoose from "mongoose";

const measurementInfoSchema = mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
    },
    height: {
        type: String,
        require: true
    },
    weight: {
        type: String,
        require: true
    },
    cheat: {
        type: String,
        require: true
    },
    arms: {
        type: String,
        require: true
    },
    forarms: {
        type: String,
        require: true
    },
    hips: {
        type: String,
        require: true
    },
    waist: {
        type: String,
        require: true
    },
    trunk: {
        type: String,
        require: true
    },
    thaght: {
        type: String,
        require: true
    },
    calf: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})

export default mongoose.model("MeasurementInfo", measurementInfoSchema)