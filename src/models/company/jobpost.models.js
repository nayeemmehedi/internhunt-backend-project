const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const { Schema, model } = mongoose;

const jobPostValue = new Schema(
  {
    job_title: {
      type: String,
      minLength: 5,
      maxLength: 150,
      required: true,
    },
    company_description: {
      type: String,
      minLength: 40,
      maxLength: 700,
      required: true,
    },
    role_job: {
      type: String,
      required: true,
    },
    skill: {
      type: String,
      required: true,
    },
    office_time: {
      type: String,
      required: true,
    },
    vacancies: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    deadtime: {
      type: String,
      required: true,
    },
    money: {
      type: String,
      required: true,
    },
    company_id: String,
    company_name: String,
    candidate_info: [
      {
        type: ObjectId,
        ref: "candidate",
      }
    ]
  },
  {
    timestamps: true,
  }
);

const jobpost = model("jobpost", jobPostValue);

module.exports = jobpost;
