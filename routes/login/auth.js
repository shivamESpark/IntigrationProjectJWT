const express = require("express");
const routes = express.Router();



const auth = require("../../controller/login/auth");
routes.post("/", auth.auth);

routes.get("/:link", auth.auth);

routes.get('/authentication/:link', auth.passwordRoute);

module.exports = routes;