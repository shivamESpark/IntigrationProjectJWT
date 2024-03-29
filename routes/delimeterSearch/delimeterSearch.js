const express = require("express");
const routes  = express.Router();
const url = require("url");
const bodyParser = require("body-parser");
const {dbConnect} = require("../../dbHandler/dbConnect");
const con = dbConnect();


routes.use(bodyParser.urlencoded({
    extended:true
}));

routes.get("/", (req, res)=>{
    let sql = req.query.sqlquery;
    let searchString = sql;
    // printing test
    console.log(sql);
    if(sql == undefined){
        sql = "";
    }

    let ss = sql;

    function splittor(ss){
        if(ss.match("_")){
            ss = ss.replace("_", "-_");
            // ss = ss.split("-");
        }
        if(ss.match("^")){
            ss = ss.replace("^", "-^");
            // ss = ss.split("-");
        }
        if(ss.match(":")){
            ss = ss.replace(":", "-:");
            // console.log(": city", ss)
        }
        if(ss.match("{")){
            ss = ss.replace("{", "-{");
            // console.log("{ phone", ss)
        }
        if(ss.match("}")){
            ss = ss.replace("}", "-}");
            // console.log("} age", ss)
        }
        if(ss.match("$")){
            ss = ss.replace("$", "-$");
            // console.log("$ email", ss)
        }
        if(ss.match("%")){
            ss = ss.replace("%", "");
            // console.log("$ email", ss)
        }
        
        let splitted = ss.split("-") 
        console.log("splite2",splitted);

        return splitted
    }

    const sarr = splittor(ss);

    function queryCreater(sarr){
        const fnameArr = [];
        const lnameArr = [];
        const emailArr = [];
        const ageArr = [];
        const mobileArr = [];
        const cityArr = [];
    
        for(let s of sarr){
            // first name
            if(s.match("_")){
                const fnames = s.split("_");
                for(let i=1; i<fnames.length; i++){
                    fnameArr.push(fnames[i]);
                }
            }
            // last name
            if(s.match("^")){
                const lnames = s.split("^");
                for(let i=1; i<lnames.length; i++){
                    lnameArr.push(lnames[i]);
                }
            }
            // email 
            if(s.match("$")){
                const email = s.split("$");
                for(let i=1; i<email.length; i++){
                    emailArr.push(email[i]);
                }
            }
            // city 
            if(s.match(":")){
                const city = s.split(":");
                for(let i=1; i<city.length; i++){
                    cityArr.push(city[i]);
                }
            }
            //age
            if(s.match("}")){
                const age = s.split("}");
                for(let i=1; i<age.length; i++){
                    ageArr.push(age[i]);
                }
            }
            //mobile
            if(s.match("{")){
                const mobile = s.split("{");
                for(let i=1; i<mobile.length; i++){
                    mobileArr.push(mobile[i]);
                }
            }
        }



        function createSubQuery(fieldName, arr){
            let str = "";
            for(let f of arr){    
                if(arr.length > 1){
                    str += `${fieldName} like "${f}%" OR `
                     // removing whitespaces
                } else {
                    str += `${fieldName} like "%${f}%" `
                }
            }
            if(arr.length>1){
                str = str.trimEnd();
                str = str.substring(0, str.lastIndexOf(" "));
            }
            return str;
        }

        // createSubQuery("column name", valueArrayName);
        let fname = createSubQuery("fname", fnameArr);
        let lname = createSubQuery("lname", lnameArr);
        let age = createSubQuery("age", ageArr);
        let email = createSubQuery("email", emailArr);
        let city = createSubQuery("city", cityArr);
        let phone = createSubQuery("phone", mobileArr);

        fnameArr.length == 0 ? fname = true : fname ;
        lnameArr.length == 0 ? lname = true : lname ;
        ageArr.length == 0 ? age = true : age;
        emailArr.length == 0 ? email = true : email;
        cityArr.length == 0 ? city = true : city;
        mobileArr.length == 0 ? phone = true :  phone;
        // .length == 0 ? age 
    

        const sql = `SELECT * FROM student2 where ${fname} and ${lname} and ${age} and ${email} and ${city} and ${phone};`
        console.log(sql);

        return sql;
      
    }



    const query = queryCreater(sarr);

    con.connect(()=>{
        con.query(query, (error, result , field)=>{
                // const r = result.length == 0 ? false : true
                
                if(!error){
                    res.render("./delimeterSearch/search", {result:result, field:field, s:searchString});
                    console.log("fetched")
                } else {
                    res.render("./delimeterSearch/search", {error:error});
                    console.log("error"+ error);
                }
            });
    })
    
});
module.exports = routes;