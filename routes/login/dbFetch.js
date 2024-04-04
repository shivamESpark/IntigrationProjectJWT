const express = require("express");
const con = require("../../dbHandler/dbConnect");

const routes = express();

const dbS = require("../../controller/login/dbFetch");
routes.get("/", dbS.dbDatas);

module.exports = routes