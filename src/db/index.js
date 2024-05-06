const mongoose = require ("mongoose");


async function dbConnection() {
 const url = `mongodb+srv://${process.env.mongodb_name}:${process.env.mongodb_pw}@cluster0.teacx.mongodb.net/${process.env.mongodb}`
  try {
    await mongoose.connect(url);
    console.log(  `mongodb connected|| DB HOST : 4500`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = dbConnection;

// local host
// const dbConnection = async () => {
//   try {
//     const mongooseConnection = await mongoose.connect(process.env.DB_NAME );
//     console.log(
//       `mongodb connected|| DB HOST : ${mongooseConnection.connection.host}`
//     );
//   } catch (error) {
//     console.log(process.env.DB_NAME)
//     console.log("Mongodb connection error: " + error);
//     process.exit(1);
//   }
// };

// module.exports = dbConnection;

// import { app } from "./app.js";
