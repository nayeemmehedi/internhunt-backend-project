const mongoose = require("mongoose");
const validator = require("validator");

const { Schema, model } = mongoose;

const candidate_info = new Schema(
  {
    candidate_name: {
      type: String,
      required: true,
    },
    candidate_email: {
      type: String,
      required: true,
    },
    github: {
      type: String,
      required: true,
    },
    linkedIn: {
      type: String,
      required: true,
    },
    candidate_cv: {
      type: String,
    },
    jobPost_id: {
      type: String,
      // required: true,
    },
    candidate_cv_details: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

const candidate = model("candidate", candidate_info);

module.exports = candidate;
