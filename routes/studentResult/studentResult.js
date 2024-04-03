const express = require("express");
const routes  = express.Router();

const studentResult = require("../../controller/studentResult/studentResult");


routes.get("/:id/:month", studentResult.home);
routes.get("/result", studentResult.result);
routes.get("/detailed", studentResult.detailed);
routes.get("/search", studentResult.search);

    
module.exports = routes;