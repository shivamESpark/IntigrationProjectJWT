const express = require("express");
const routes = express.Router();

const createPassword = require("../../controller/login/createPassword");
routes.post("/", createPassword.createPassword);

module.exports = routes;