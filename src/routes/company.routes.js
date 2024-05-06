const express = require("express");
const {
  jobpostController,
  showCvDetailsController,
  singleJobDetailsController,
  singleJobPostDelete,
  totalJobController,
  updateProject
} = require("../controllers/company/jobPost.controller.js");
const { signupControllerGet } = require("../controllers/authentication.controllers.js");

const companyRoutes = express.Router();

companyRoutes.post('/jobpost',jobpostController )
companyRoutes.get('/totalJob',totalJobController )
companyRoutes.get('/singleJobDetails/:id',singleJobDetailsController )
companyRoutes.get('/jobList/:company_id',signupControllerGet )
companyRoutes.get('/showCvDetails/:id',showCvDetailsController )

companyRoutes.delete('/deleteJobPost/:id',singleJobPostDelete )
companyRoutes.patch('/companyPermission/:id',updateProject )




module.exports = {
    companyRoutes
  };
