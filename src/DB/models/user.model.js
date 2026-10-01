import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fName: { type: String, required: true, minlength: 2, trim: true },
    lName: { type: String, required: true, minlength: 2, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number, min: 12, max: 100 },
    gender: { type: String, enum: ["male", "female"], default: "male" },
    phone: { type: String },
    provider: { type: String, enum: ["system", "google"], default: "system" }
}, { timestamps: true })

const userModel = mongoose.models.User || mongoose.model("User", userSchema)
export default userModel