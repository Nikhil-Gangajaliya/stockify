import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        password: {
            type: String,
            required: true
        },
        store: {
            trype: mongoose.Schema.Types.ObjectId,
            ref: "Store"
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);



