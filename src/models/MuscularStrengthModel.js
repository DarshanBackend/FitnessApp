import mongoose from "mongoose";

const muscularStrengthSchema = mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
    },
    uperLoby: {
        type: String,
        require: true
    },
    lowerLody: {
        type: String,
        require: true
    },
  
}, {
    timestamps: true
})

export default mongoose.model("MuscularStrength", muscularStrengthSchema)