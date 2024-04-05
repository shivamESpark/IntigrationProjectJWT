const {dbConnect} = require("../../dbHandler/dbConnect");
const con = dbConnect();


function randomString(size){
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    let rstr = ""

    for(let i=0; i<size; i++){
        let n = Math.round(Math.random() * str.length);
        rstr += str[n];
    }
    return rstr;
}


const checkEmail = (email) =>{
    return new Promise((resolve, reject)=>{
        const eSql = "select email from users where email = ?";
        con.query(eSql, [email], (err, result)=>{
            if(err){
                return reject(err);
            } else {
                return resolve(result);
            }
        });
    });
}

const insertUser = (fname, lname, email, dob, gender, alink) => {
    return new Promise((resolve , reject)=>{
        const salt = randomString(4).slice(0,4);
        console.log(salt + " salt data");
        const iSql = "insert into users (fname, lname, email, dob, gender, salt, a_link) values(?,?,?,?,?,?,?)";
        con.query(iSql, [fname, lname, email, dob, gender, salt, alink], (error, result) => {   
            if(error){
                return reject(error);
            } else {
                return resolve(result);
            }
        });
    });
}


function passwordRoute(req,res){
    res.render("./login/createPassword")
}


function isEmail(email) {
    const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    // var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== '' && email.match(emailFormat)) { return true; }
    
    return false;
}


function checkDate(date) {
    
    // Date format: YYYY-MM-DD
    var datePattern = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

    // Check if the date string format is a match
    var matchArray = date.match(datePattern);
    if (matchArray == null) {
        return false;
    }

    // Remove any non digit characters
    var dateString = date.replace(/\D/g, ''); 

    // Parse integer values from the date string
    var year = parseInt(dateString.substr(0, 4));
    var month = parseInt(dateString.substr(4, 2));
    var day = parseInt(dateString.substr(6, 2));

    // Define the number of days per month
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        daysInMonth[1] = 29;
    }

    if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
        return false;
    }
    return true;
}

const auth = async(req, res)=>{
    try{
        const data = req.body;
        const fname = data.fname;
        const lname = data.lname;
        const email = data.email;
        const dob = data.dob;
        const gender = data.gender;
        let result = undefined;

        if(!(fname && lname && dob && gender && email)){
            res.status(301).json({message:"there might be some empty fields"});
        } else {

            if(!isEmail(email)){
                res.status(302).json({message : "enter valid email"});
            } else if(!checkDate(dob)){
                res.status(303).json({message : "enter valid date"});
            } else {
                try{
                    result = await checkEmail(email);
                } catch (error) {
                    res.status(501).json({message:"email check sql error => " + err});
                }
    
                if(result.length>0){
                    res.status(201).json({message:"user already exists"});
                } else {
                    try{
                        const alink = randomString(16);
                        result = await insertUser(fname, lname, email, dob, gender, alink);
                        // passwordRoute(alink);
                        req.params = {"link" : `authentication/:${alink}`}
                        setTimeout(() => {
                            req.params = {"link" : `authentication/:`}
                        }, 10000);

                        res.status(200).json({message:"user registration successful", alink : `http://localhost:8080/addUser/authentication/:${alink}`});
                    } catch (error) {
                        console.log(error)
                        res.status(502).json({message:"User insertion failed"});
                    }
                }
            }

        }

    } catch (error){
        res.status(500).json({error:"Registration failed"});
    }
}


module.exports = {auth, passwordRoute}