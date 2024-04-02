const express = require("express");
const routes  = express.Router();
const url = require("url");
const bodyParser = require("body-parser");
const {dbConnect} = require("../../dbHandler/dbConnect");
const { error } = require("console");
const con = dbConnect();


routes.get("/", (req, res, next)=>{
    const baseUrl = url.parse(req.url, true);
    let field = baseUrl.query.comp;


    qry = `select s.select_field as field_name, s.unique_name as unique_name, s.type as type, s.multipleValue as multi, o.option_key as option_key, o.option_value as option_value from option_master as o join select_master as s on s.id = o.sid where select_field = "${field}";`;

    //select s.select_field as field_name, s.unique_name as unique_name, s.type as type, s.multipleValue as multi, o.option_key as option_key, o.option_value as option_value from option_master as o join select_master as s on s.id = o.sid where select_field = "relation";
    con.connect(()=>{
        con.query(qry,(error, result, field)=>{

            if(!error){
                res.render("./dynamicComponent/component", {result:result, field:field});
            } else {
                res.render("./dynamicComponent/component", {error:error});
            }
        });
    })

});


module.exports = routes;