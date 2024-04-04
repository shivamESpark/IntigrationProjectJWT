const express = require("express");
const routes = express.Router();





const singinLogin = require("../../controller/login/login");

routes.get("/", singinLogin.loginR);
routes.post("/", singinLogin.loginD);


module.exports = routes;