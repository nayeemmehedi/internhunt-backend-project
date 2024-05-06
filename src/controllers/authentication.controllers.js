const signup = require("../models/signup.models.js");
const { ApiResponse } = require("../utils/apiHandler.js");

exports.signupController = async (req, res, next) => {
  try {
    const user = await signup.findOne({ email: req.body && req.body.email });
    if (user) {
      return res.send(
        new ApiResponse(200, { message: "User already login" }, true)
      );
    }

    const userCreate = new signup(req.body);
    if (userCreate.role === "company") {
      userCreate.pending = true;
    }
    await userCreate.save();
    return res.send(
      new ApiResponse(200, { message: "Successfully Login" }, true)
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      // If Mongoose validation error, send back 400 with detailed error messages
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).send({ message: "Validation failed", errors });
    }
    return res.send({ message: error.message, error: error });
  }
};

exports.signupControllerGet = async (req, res, next) => {
  try {
    if (!req.params || !req.params.company_id) {
      return res.send(
        new ApiResponse(200, { message: "Provide an email" }, true)
      );
    }

    const mainUser = await signup.findOne({ _id: req.params.company_id });

    if (!mainUser) {
      return res.send(
        new ApiResponse(200, { message: "Can't find a user" }, true)
      );
    } else if (mainUser.role !== "company" || mainUser.pending) {
      return res.send(
        new ApiResponse(200, { message: "Still Not permission" }, true)
      );
    }
    const user = await signup
      .findOne({ _id: req.params.company_id })
      .select("JobPost")
      .populate("JobPost");
    return res.send(
      new ApiResponse(200, { message: "Successfully Login", value: user }, true)
    );
  } catch (error) {
    return res.status(400).send({ message: error.message, error });
  }
};
