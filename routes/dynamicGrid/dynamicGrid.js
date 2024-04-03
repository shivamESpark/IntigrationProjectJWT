const express = require("express");
const routes  = express.Router();


const dynamic =  require("../../controller/dynamicGrid/dynamicGrid");
routes.get("/:id", dynamic.dynamicGrid);



module.exports = routes;