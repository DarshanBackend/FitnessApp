import mongoose from "mongoose";
import jwt from "jsonwebtoken"

const registerSchema = mongoose.Schema({
    name: {
        type: String
    },
    contact: {
        type: String
    },
    email: {
        type: String
    },
    birth_date: {
        type: Date
    },
    password: {
        type: String
    },
    trainer_image: {
        type: String
    },
    type: {
        type: String,
        enum: ["trainer", "user"]
    },
    resetOTP: {
        type: Number
    },
    otpExpires: {
        type: Date
    }
})

registerSchema.methods.getJWT = async function () {
    const register = this;

    const token = jwt.sign({ _id: register._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return token;
};

registerSchema.methods.validatePassword = async function (passwordInputByUser) {
    const register = this;
    const passwordhash = register.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordhash
    );

    return isPasswordValid;
};

export default mongoose.model("Register", registerSchema)