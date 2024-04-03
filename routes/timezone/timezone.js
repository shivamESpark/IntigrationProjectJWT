const express = require("express");
const routes  = express.Router();

const timezones = require("../../controller/timezone/timezone");


routes.get("/db", timezones.timezones);
routes.get("/", timezones.times);

module.exports = routes;