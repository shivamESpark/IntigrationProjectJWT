const express = require("express");
const routes  = express.Router();
const url = require("url");
const bodyParser = require("body-parser");
const {dbConnect} = require("../../dbHandler/dbConnect");
const { error } = require("console");
const con = dbConnect();


routes.get("/:id", (req, res)=>{
    //variable declaration
    let field = undefined;
    let result = undefined;
    
    let pid = req.params.id;
    console.log("pid ", pid)
    // fetching from url 
    const baseUrl = url.parse(req.url, true);
    const qsql = baseUrl.query.sqlquery;

    //pid = baseUrl.query.pid;
    let ssql = null;
    let lsql = null;
    if(qsql != undefined){
        if(qsql.match("limit")){
            ssql = qsql.split("limit")[0];
            lsql = qsql.split("limit")[1];
        } else if(qsql.match(";")){
            ssql = qsql.split(";")[0];
        } else {
            ssql = qsql;
        }
    }


    function findNumeric(str){
        return str.match(/\d+/g);
    }

    let offset = 15;
    if(lsql == null){
        lsql = 15;
    } else {
        lsql = findNumeric(lsql)[0];
        lsql = String(lsql);
        console.log("limit ", typeof lsql, lsql)
    
    }


    let psql = `${ssql} limit ${(+pid-1)*lsql},${lsql}`
    console.log("psql ",  psql);
    
    if(ssql != null || ssql != undefined){
        con.query(`${psql};${ssql}`, [1,2], (error, result, field)=>{
            console.log(`${psql};${ssql}`);
            if(!error){
                console.log("fetched...");
                let nPage = result[1].length;
                nPage =  Math.round(nPage/lsql);
    
                console.log("page : ", Math.round(nPage/offset));
                
                res.render("./dynamicGrid/dynamic", {error:error, result:result[0], field:field[0], pid:pid, nPage:nPage, psql:qsql});
            } else {
                res.render("./dynamicGrid/dynamic", {error:error, field:field});
            }
        });
    } else {
        res.render("./dynamicGrid/dynamic",{field:undefined, error:true});
    }
    
});



module.exports = routes;