const express = require("express");
const routes  = express.Router();


// for the dynamic table intigration
const kukuCube = require("../../controller/kukuCube/kukuCube");
routes.get("/", kukuCube.kukuCube);

module.exports = routes;
