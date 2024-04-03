const express = require("express");
const routes  = express.Router();


const dynamicComp = require("../../controller/dynamicComponent/dynamicComponent");
routes.get("/", dynamicComp.dynamicComponent);


module.exports = routes;