const {dbConnect} = require("../../dbHandler/dbConnect");
const con = dbConnect;
const dbDatas = (req, res)=>{
    const sqlI = "select * from users";
    console.log(con);
    con.query(sqlI, (err, result)=>{
        if(err){
            res.status(500).json({message:"error while fetching data!"});
        } else {
            res.status(200).json({message:"Data has been fetched!", result})
        }
    })
}

module.exports = {dbDatas};