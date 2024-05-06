const ApiResponse = require("../utils/apiHandler.js").ApiResponse;
const signup = require("../models/signup.models.js");

const loginController = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json(new ApiResponse(400, { message: "Please enter valid credentials..." }, false));
    }

    const user = await signup.findOne({ email });
    if (!user) {
      return res.status(400).json(new ApiResponse(400, { message: "Please enter valid credentials!" }, false));
    }

    const checkPasswordDone = await user.passwordCheck(password);
    if (!checkPasswordDone) {
      return res.status(400).json(new ApiResponse(400, { message: "Invalid password!!!" }, false));
    }

    if (role !== user.role) {
      return res.status(400).json(new ApiResponse(400, { message: "Please enter a valid role" }, false));
    }

    if (user.pending) {
      return res.status(400).json(new ApiResponse(400, { message: "Still Panding for request Company" }, false));
    }

    const accessToken = user.accessTokenMethods(user);
    const refreshToken = user.refreshTokenMethods(user);

    user.refreshToken = refreshToken;
    await user.save();

    const options = {
      httpOnly: true,
      secure: true,
    };

    const responseData = new ApiResponse(
      200,
      {
        accessToken,
        refreshToken,
        userName: user.username,
        userEmail: email,
        role: user.role,
        pending: user.pending,
        id: user._id,
      },
      true
    );

    res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(responseData);
  } catch (error) {
    res.status(400).json(new ApiResponse(400, { message: error.message, error: error }, false));
  }
};

const CompanyInfoController = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const data = await signup.find({ role: "company" });

    if (!data) {
      const responseData = new ApiResponse(
        400,
        {
          value: "Data not found",
        },
        true
      );

      res.json(responseData);
    }

    const responseData = new ApiResponse(
      200,
      {
        value: data,
      },
      true
    );

    res.status(200).json(responseData);
  } catch (error) {
    res.status(400).json(new ApiResponse(400, { message: error.message, error: error }, false));
  }
};

module.exports = { loginController, CompanyInfoController };
