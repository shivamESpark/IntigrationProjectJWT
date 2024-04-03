const url = require("url");
const {dbConnect} = require("../../dbHandler/dbConnect");
const con = dbConnect();

const timezones = (req, res)=>{
    // console.log("hello db");
    const sqlFetch = "select * from timezones";  

    con.query(sqlFetch, (err, result)=>{
        if(err){
            console.log("SQL error", err);
            return;
        } else {
            console.log("data fetched");
            res.json(result);
        }
    });
}

const times  = (req, res)=>{
    res.render("./timezone/timezone");
}


module.exports = {timezones, times};