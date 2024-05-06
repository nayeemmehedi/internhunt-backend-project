const jobpost = require("../../models/company/jobpost.models.js");
const signup = require("../../models/signup.models.js");
const { ApiResponse } = require("../../utils/apiHandler.js");

const jobpostController = async (req, res) => {

  try {
    const value = await jobpost.create(req.body);

    const updateValue = await signup.updateOne(
      { _id: value.company_id },
      { $push: { JobPost: value._id } }
    );

    const responseData = new ApiResponse(
      200,
      {
        message: "OK",
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

const totalJobController = async (req, res) => {
  try {
    const { searchTerm = "", page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const regex = new RegExp(searchTerm, "i"); // 'i' for case-insensitive search

    const totalDocs = await jobpost.countDocuments({
      job_title: { $regex: regex },
    });

    const totalPages = Math.ceil(totalDocs / limit);

    const jobs = await jobpost
      .find({ job_title: { $regex: regex } })
      .skip(skip)
      .limit(limit)
      .lean();

    const responseData = new ApiResponse(
      200,
      {
        message: "OK",
        value: jobs,
        currentPage: page,
        totalPages,
        totalDocs,
        limit,
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

const singleJobDetailsController = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return res.send(new ApiResponse(200, { message: "Not Found" }, true));
    }

    const mainUser = await jobpost.findOne({ _id: req.params.id });

    if (!mainUser) {
      return res.send(
        new ApiResponse(200, { message: "Can't find a user" }, true)
      );
    }

    return res.send(
      new ApiResponse(
        200,
        { message: "Successfully Login", value: mainUser },
        true
      )
    );
  } catch (error) {
    return res.status(400).send({ message: error.message, error });
  }
};

const singleJobPostDelete = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await jobpost.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const showCvDetailsController = async (req, res) => {
  try {
    const itemId = req.params.id;
    const Item = await jobpost.find({ _id: itemId }).populate("candidate_info");

    if (!Item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const responseData = new ApiResponse(
      200,
      {
        message: "OK",
        value: Item[0],
      },
      true
    );

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = await signup.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(new ApiResponse(200, { value: updatedProject }, true));
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  jobpostController,
  totalJobController,
  singleJobDetailsController,
  singleJobPostDelete,
  showCvDetailsController,
  updateProject,
};
