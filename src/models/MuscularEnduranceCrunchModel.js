import mongoose from "mongoose";

const muscularEnduranceCrunchSchema = mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
    },
    crunch: {
        type: String,
        require: true
    },
  
}, {
    timestamps: true
})

export default mongoose.model("MuscularEnduranceCrunch", muscularEnduranceCrunchSchema)