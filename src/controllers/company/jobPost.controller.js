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
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch the paginated job data
    const jobs = await jobpost.find({}).skip(skip).limit(limit + 1).lean();

    // Calculate the total number of pages
    const totalDocs = jobs.length;
    const hasMore = jobs.length > limit;
    const totalPages = hasMore ? Math.ceil(totalDocs / limit) : page;

    // Remove the extra document if it exists
    if (hasMore) {
      jobs.pop();
    }

    // Update the response with the job data
    const responseData = {
      message: "OK",
      value: jobs,
      currentPage: page,
      totalPages: totalPages,
      totalDocs: totalDocs,
      limit: limit,
    };

    res.json( new ApiResponse(
      200,
      { message: "Successfully Login", data: responseData },
      true
    ));
  } catch (error) {
    res.status(400).json({ message: error.message, error: error });
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
