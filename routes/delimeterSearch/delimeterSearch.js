const express = require("express");
const routes  = express.Router();
const url = require("url");
const bodyParser = require("body-parser");



routes.use(bodyParser.urlencoded({
    extended:true
}));



const delimieter = require("../../controller/delimeterSearch/delimeterSearch");
routes.get("/", delimieter.delimeterSearch);
module.exports = routes;