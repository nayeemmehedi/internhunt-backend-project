const admin = require("firebase-admin");
const { ApiResponse } = require("../utils/apiHandler.js");
// const serviceAccount = require("../utils/firebase.json");
const signup = require("../models/signup.models.js");
const serviceAccountValue = require("../utils/firebase.jsx");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountValue),
});

const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const user = await admin.auth().getUser(uid);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const goggleLogin = async (req, res) => {
  try {
    const user = await verifyIdToken(req.body.idToken);
    let payload = await signup.findOne({ email: user.email });
    let newUser = new signup({
      email: user.email,
      username: user.displayName,
      googleId: user,
      emailVerified: user.emailVerified,
      // _id:user.uid
    });
    const accessToken = newUser.accessTokenMethods(newUser);
    const refreshToken = newUser.refreshTokenMethods(newUser);
    newUser.refreshToken = refreshToken;

    if (!payload) {
      await newUser.save();
      let payloadnew = await signup.findOne({ email: user.email });
      const options = {
        httpOnly: true,
        secure: true,
      };
      const responseData = new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
          userName: payloadnew.username,
          userEmail: payloadnew.email,
          role: payloadnew.role,
          pending: payloadnew.pending,
          id: payloadnew._id,
        },
        true
      );
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(responseData);
    } else {
      const options = {
        httpOnly: true,
        secure: true,
      };
      const responseData = new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
          userName: payload.username,
          userEmail: payload.email,
          role: payload.role,
          pending: payload.pending,
          id: payload._id,
        },
        true
      );
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(responseData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { goggleLogin };