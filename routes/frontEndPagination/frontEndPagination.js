const express = require("express");
const routes  = express.Router();


// for the dynamic table intigration
const frontEndPagination = require("../../controller/frontEndPagination/frontEndPagination");
routes.get("/", frontEndPagination.frontEndPagination);

module.exports = routes;