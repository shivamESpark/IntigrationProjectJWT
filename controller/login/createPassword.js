const md5 = require("md5");
const { dbConnect } = require("../../dbHandler/dbConnect");
const con = dbConnect();
const jwt = require("jsonwebtoken");
const url = require("url");
const { route } = require("./auth");
const { BADSTR } = require("dns");
const { constants } = require("buffer");


const insertPassword = (password, alink) => {
    return new Promise((resolve, reject) => {
        const pSql = "update users set passwords = ? where a_link = ?";
        con.query(pSql, [password, alink], (error, result) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(result);
            }
        });
    });
}

const fetchSalt = (alink) => {
    return new Promise((resolve, reject) => {
        const sSalt = "select salt from users where a_link = ?";
        con.query(sSalt, [alink], (error, result)=>{
            if(error){
                return reject(error);
            } else {
                return resolve(result);
            }
        })
    })
}


const createPassword = async (req, res) => {
    const cPassword = req.body.cPassword;
    const rPassword = req.body.rPassword;
    const alink = req.body.alink;
    let salt = undefined;
    // console.log(req.body);


    if(!(cPassword || rPassword)){
        
        res.status(300).json({message:"empty passoword not allowed"});

    } else {
        
            if(rPassword == cPassword){
                try {
                    const result = await fetchSalt(alink);
                    salt = result[0].salt;
                    // console.log(result[0].salt + "   salt");
                } catch (error) {
                    res.status(500).json({ messge: "error fetching salt" });
                    console.log("fetching salt error => " + error);
                }
        
                try {
                    const passwordMD5 = md5(salt + rPassword);
                    result = await insertPassword(passwordMD5, alink);
                    // console.log(passwordMD5, alink, salt)
                    res.status(200).json({messge: "password has been set"});
                } catch (error) {
                    res.status(501).json({ messge: "error setting password" });
                    console.log("setting password error = > " + error)
                }
            }

    }
}


module.exports = {createPassword};