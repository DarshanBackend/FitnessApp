import mongoose from "mongoose";

const flexiblitiySchema = mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
    },
    seat_reach_test: {
        type: String,
        require: true
    },
}, {
    timestamps: true
})

export default mongoose.model("Flexiblitiy", flexiblitiySchema)