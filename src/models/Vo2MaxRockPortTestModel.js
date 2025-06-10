import mongoose from "mongoose";

const vo2MaxRockPortTestSchema = mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
    },
    vo2_max_rock: {
        type: String,
        require: true
    },
  
}, {
    timestamps: true
})

export default mongoose.model("Vo2MaxRockPortTest", vo2MaxRockPortTestSchema)