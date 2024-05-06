const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { configValue } = require("../config/index.js");
const validator = require("validator");

const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const signupValue = new Schema(
  {
    username: {
      type: String,
      minLength: 1,
      maxLength: 20,
      required: true,
    },
    email: {
      type: String,
      // unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
      required: true,
    },
    password: {
      type: String,
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minUppercase: 1,
            // minSymbols: 1,
          }),
        message: "Password {VALUE} is not Strong. minLength: 6,minUppercase: 1,",
      },
      // required: true,
    },
    confirmPassword: {
      type: String,
      // required: true,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password don't match",
      },
    },
    role: {
      type: String,
      default: "intern",
      enum: ["intern", "company", "admin"],
    },
    pending: {
      type: Boolean,
      default: false,
    },
    refreshToken: String,
    emailVerified:{
      type: Boolean,
      default: false,
    },
    accessToken: String,
    googleId: Schema.Types.Mixed,
    JobPost: [
      {
        type: ObjectId,
        ref: "jobpost",
      },
    ],
  },
  {
    timestamps: true,
  }
);

signupValue.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    if (this.confirmPassword) {
      const match = await bcrypt.compare(this.confirmPassword, hash);
      if (!match) {
        return next(new Error("Passwords do not match"));
      } else {
        return this.confirmPassword = undefined;
      }
    }
  }
  next();
});

signupValue.method("passwordCheck", async function (password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
});

signupValue.methods.accessTokenMethods = function (data) {
  return jwt.sign(
    {
      _id: data._id,
      email: data.email,
    },
    process.env.accees_token_secrat,
    { expiresIn: "15m" }
  );
};

signupValue.methods.refreshTokenMethods = function (data) {
  return jwt.sign(
    {
      _id: data._id,
      email: data.email,
    },
    process.env.refresh_token_secrat,
    { expiresIn: "30d" }
  );
};

const signup = model("signup", signupValue);

module.exports = signup;
