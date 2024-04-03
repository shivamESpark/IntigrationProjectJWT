const express = require("express");
const routes  = express.Router();


const studentPagination = require("../../controller/studentPagination/studentPagination");
routes.get("/:field/:sorder/:id", studentPagination.studentPagination);


module.exports = routes;
