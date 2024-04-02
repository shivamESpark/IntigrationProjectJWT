const express = require("express");
const routes = express.Router();
const md5 = require("md5");
const { dbConnect } = require("../dbHandler/dbConnect");
const con = dbConnect();
require("dotenv").config();
const jwt = require("jsonwebtoken");






routes.get("/", (req, res) => {
    res.render("login");
});



const fetchData = (email) => {
    return new Promise((resolve, reject) => {
        const lSql = "select salt, email, passwords from users where email = ?";
        con.query(lSql, [email], (error, result)=>{
            if(error){
                return reject(error);
            } else {
                return resolve(result);
            }
        });
    });
}



routes.post("/", async (req, res)=>{
    const password = req.body.password;
    const email = req.body.email;

    let result = undefined;
     
    if((email && password)){
        try{
            result = await fetchData(email);
        } catch (error) {
            res.status(500).json({message:"Error While Fetching username!"});
            console.log(error, "while fetchign the emails");
        }
    
    
        if(result.length == 0){
            res.status(201).json({message:"The user not found"});
        } else {
            const emailDB = result[0].email;
            const passwordDB = result[0].passwords;
            const saltDB = result[0].salt;
    
            const passwordMd5 = md5(saltDB + password);
            if(passwordMd5 == passwordDB){
                const token = jwt.sign({ email :email }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
        
                return res.cookie("access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                }).status(200).json({message : "logged in succesfuly", link:"http://localhost:8080/home"});       
                
            } else {
                
                res.status(203).json({message:"username or password is wrong!"});
    
            }
    
        }
    }

})


// routes.post("/", (req, res) => { 

// })

module.exports = routes;