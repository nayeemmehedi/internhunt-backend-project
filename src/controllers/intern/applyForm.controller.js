const jobpost = require("../../models/company/jobpost.models.js");
const candidate = require("../../models/intern/internApply.modules.js");
const { ApiResponse } = require("../../utils/apiHandler.js");
const cloudinary = require("cloudinary").v2;

const applyFormController = async (req, res) => {
 

  try {
    const user = await candidate.findOne({ candidate_email: req.body && req.body.candidate_email });
    if (user) {
      res.send(
        new ApiResponse(200, { message: "User already Applied." }, true)
      );
    }

    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
    });

    const userCreate = new candidate(req.body);

    const file_upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "internHunt",
      resource_type: "auto",
      use_filename: true,
      unique_filename: false,
    });
    userCreate.candidate_cv = file_upload.url;
    userCreate.candidate_cv_details = file_upload;

    const value = await userCreate.save();

    const updateValue = await jobpost.updateOne(
      { _id: value.jobPost_id },
      { $push: { candidate_info: value._id } }
    );

    const responseData = new ApiResponse(
      200,
      {
        message: "OK",
        value,
      },
      true
    );

    res.json(responseData);
  } catch (error) {
    res
      .status(400)
      .json(
        new ApiResponse(400, { message: error.message, error: error }, false)
      );
  }
};

module.exports = { applyFormController };
