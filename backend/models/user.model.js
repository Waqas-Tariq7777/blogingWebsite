import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new Schema({

    userName:{
        type: String,
        required: true,
        unique: true
    },
     email:{
        type: String,
        required: true,
        unique: true
    },
     password:{
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5Z2bdjhH-9nWEkTPT0KdYfjMsASIKcLGCsG7Ii4iZ7txOjOVCkw5sIjDabbkb8ciRSuI&usqp=CAU"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true}
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema);