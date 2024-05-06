const signup = require("../models/signup.models.js");

const LogOutController = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Find the user by the refresh token
    const user = await signup.findOne({ refreshToken: refreshToken });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Clear the refresh token in the database
    user.refreshToken = null;
    const updatedUser = await user.save();

    res.json({ success: true, message: "Logout successful" });
  } catch (err) {
    console.error("Error logging out:", err); // Add this line
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = LogOutController;
