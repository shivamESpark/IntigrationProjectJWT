const express = require("express");
const routes  = express.Router();


// for the dynamic table intigration
routes.get("/", (req, res)=>{
    res.render("./frontEndPagination/frontendpagination");
})

module.exports = routes;