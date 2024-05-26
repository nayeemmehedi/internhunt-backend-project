const admin = require("firebase-admin");
const { ApiResponse } = require("../utils/apiHandler.js");
// const serviceAccount = require("../utils/firebase.json");
const signup = require("../models/signup.models.js");
const serviceAccountValue = require("../utils/firebase.jsx");
const jwt = require("jsonwebtoken");

function generateAccessToken(data) {
  return jwt.sign(
    {
      // _id: data._id,
      email: data.email,
    },
    process.env.accees_token_secrat,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken(data) {
  return jwt.sign(
    {
      // _id: data._id,
      email: data.email,
    },
    process.env.refresh_token_secrat,
    { expiresIn: "30d" }
  );
}

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
    console.log("start login");
    //succefuuly get token
    const user_token = await verifyIdToken(req.body.idToken);
    let firebase_user_info = await signup.findOne({ email: user_token.email });
    console.log("firebase_user_info");

    if (!firebase_user_info) {
      let newUser = new signup({
        email: user_token.email,
        username: user_token.displayName,
        googleId: user_token,
        emailVerified: user_token.emailVerified,
      });
      const accessToken = await newUser.accessTokenMethods(newUser);
      const refreshToken = await newUser.refreshTokenMethods(newUser);

      console.log("Access token new", accessToken);

      newUser.refreshToken = refreshToken;
      await newUser.save();
      let withoutRefeshTokenUser = await signup.findOne({
        email: user_token.email,
      });
      const options = { httpOnly: true, secure: true };
      const responseData = new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
          userName: withoutRefeshTokenUser.username,
          userEmail: withoutRefeshTokenUser.email,
          role: withoutRefeshTokenUser.role,
          pending: withoutRefeshTokenUser.pending,
          id: withoutRefeshTokenUser._id,
        },
        true
      );
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(responseData);
    } else {
      console.log("next");

      let newUser = new signup(firebase_user_info);

      const accessToken = generateAccessToken(firebase_user_info);
      const refreshToken = generateRefreshToken(firebase_user_info);



        const updatedProject = await signup.findByIdAndUpdate(
          { _id: firebase_user_info._id },
          { $set: {refreshToken:refreshToken} },
          {
            new: true,
            runValidators: true,
          }
        );

        if (!updatedProject) {
          return res.status(404).json({ message: "Project not found" });
        }

        const options = { httpOnly: true, secure: true };
        const responseData = new ApiResponse(
          200,
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
            userName: firebase_user_info.username,
            userEmail: firebase_user_info.email,
            role: firebase_user_info.role,
            pending: firebase_user_info.pending,
            id: firebase_user_info._id,
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
    res.status(500).json({ error: error.toString(), message: error.message });
  }
};

module.exports = { goggleLogin };
