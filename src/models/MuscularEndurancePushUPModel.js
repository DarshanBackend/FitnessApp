import mongoose from "mongoose";

const muscularEndurancePushUPSchema = mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
    },
    pushUp: {
        type: String,
        require: true
    },
  
}, {
    timestamps: true
})

export default mongoose.model("MuscularEndurancePushUP", muscularEndurancePushUPSchema)