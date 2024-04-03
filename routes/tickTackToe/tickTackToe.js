const express = require("express");
const routes  = express.Router();


// for the dynamic table intigration
const tickTac = require("../../controller/tickTacToe/tickTacToe");
routes.get("/", tickTac.tickTac);

module.exports = routes;
