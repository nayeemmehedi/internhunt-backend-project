const  dbConnection = require ("./db/index.js");
// import { app } from "./app.js";
const app = require("./app.js")

dbConnection()
.then(() => {
  app.listen(process.env.PORT || 4500);
}).catch(err=>{
    console.log("[index.js] error: " + err.message)
})



