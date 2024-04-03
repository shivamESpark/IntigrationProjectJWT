const express = require("express");
const routes  = express.Router();


// for the dynamic table intigration
const dynamicTable = require("../../controller/dynamicTable/dynamicTable");
routes.get("/", dynamicTable.dynamicTable);

module.exports = routes;
