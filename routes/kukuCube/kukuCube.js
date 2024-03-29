const express = require("express");
const routes  = express.Router();


// for the dynamic table intigration
routes.get("/", (req, res)=>{
    res.render("./kukuCube/kukuCube");
})

module.exports = routes;
