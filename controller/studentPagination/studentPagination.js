const url = require("url");
const bodyParser = require("body-parser");
const {dbConnect} = require("../../dbHandler/dbConnect");
const con = dbConnect();
    

const studentPagination = (req, res)=>{
    const pid = req.params.id;
    const fieldname = req.params.field;
    const sort = req.params.sorder;
    console.log(fieldname);
    console.log(sort);

    console.log("trying to connect with db ~~<  =[]");
    con.connect(()=>{
        try{
            // http://localhost:8080/fname/asc/1
            
            fieldname === undefined ? fieldname= "sid" : true;
            sort === undefined ? fieldname = "asc" : true;
            console.log("connected --<=[]");
            console.log("fetching record");
            
            
            con.query(`select * from student order by ${fieldname} ${sort} limit ${(+pid-1)*50},50`, (err, result, fields)=>{
                if(!err){
                    res.render('./studentSortingPagingURL/page', {pid:pid, result:result, sort:sort, field:fieldname});
                } else {
                    console.log("error" + err);
                }
            });
        } catch(err){
            console.log(err)
        }
    });
}

module.exports = {studentPagination};