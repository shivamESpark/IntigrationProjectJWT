const express = require("express");
const routes  = express.Router();


// for the dynamic table intigration
const eventsTabel = require("../../controller/eventTable/eventTable");
routes.get("/", eventsTabel.eventTable);

module.exports = routes;
