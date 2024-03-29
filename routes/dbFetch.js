const express = require("express");
const con = require("../dbHandler/dbConnect");

const routes = express();

routes.get("/", (req, res)=>{
    const sqlI = "select * from users";
    console.log(con);
})

module.exports = routes