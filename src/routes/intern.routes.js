const express = require("express");
const { applyFormController } = require("../controllers/intern/applyForm.controller.js");
const uploader = require("../middleware/uploader.middleware.js");

const internRoutes = express.Router();

internRoutes.post('/intern_apply_form', uploader.single("pdfFile"), applyFormController);

module.exports = {
  internRoutes
};

