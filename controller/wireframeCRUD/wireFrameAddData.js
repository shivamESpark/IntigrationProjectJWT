const url = require("url");
const bodyParser = require("body-parser");
const {dbConnect} = require("../../dbHandler/dbConnect");
const con = dbConnect();

const home = (req, res)=>{
    res.render("./wireFrameCRUD/home");
}

const addDataG = (req, res, next)=>{
    res.render("./wireFrameCRUD/index");
}

const addData = (req, res)=>{

    // console.log(req.body.fname);
    const dt = req.body;
    const fname = dt.fname;
    const lname = dt.lname;
    const designation = dt.desingnation;
    const add1 = dt.address1;
    const add2 = dt.address2;
    const email = dt.email;
    const city = dt.city;
    const phone = dt.phone;
    const state = dt.state;
    const gender = dt.gender;
    const relation = parseInt(dt.relation);
    const dob = dt.dob;
    const zipcode = dt.zipcode;

    
    // education
    // console.log(dt)
    let educationName = dt["education[]"].split(","); // arr
    let educationYear = dt["educationYear[]"].split(",") // arr
    let educationPercentage = dt["educationPercentage[]"].split(",") //arr

    console.log(educationName, educationYear, educationPercentage);
    if(!Array.isArray(educationName)){
        educationName = Array(educationName);
        // console.log("array")
    }
    if(!Array.isArray(educationYear)){
        educationYear = Array(educationYear);
        // console.log("array")
    }
    if(!Array.isArray(educationPercentage)){
        educationPercentage = Array(educationPercentage);
        // console.log("array")
    }
    console.log(educationName, educationYear, educationPercentage);
    

    // launguages known
    let languages = dt["language[]"].split(",");
    let read = dt["read[]"].split(",");
    let write = dt['write[]'].split(",");
    let speak = dt['speak[]'].split(",");
    console.log("lang = ", languages,read, write, speak)
    // if not array while returning single value
    if(!Array.isArray(languages)){
        languages = Array(languages)
        // console.log("array")
    }
    if(!Array.isArray(read)){
        read = Array(read);
        // console.log("read arr")
    }
    if(!Array.isArray(write)){
        write = Array(write);
        // console.log("writearr") 
    }
    if(!Array.isArray(speak)){
        speak = Array(speak);
        // console.log("speak arr")
    }

    // while there is no field selected
    if(languages[0] == undefined){
        languages[0] = 'English';
    }

    // // console.log(languages)
    // // console.log(read)
    // // console.log(write)
    // // console.log(speak)

    // technologies
    let technologies = dt["technologies[]"].split(",");
    let php = dt.php;
    let py = dt.python;
    let jv = dt.java;
    console.log("technology = ", technologies, dt.php, dt.python, dt.java)
    if(!Array.isArray(technologies)){
        technologies = Array(technologies)
    }
    if(!Array.isArray(php)){
        php = Array(php)
    }
    if(!Array.isArray(py)){
        py = Array(py)
    }
    if(!Array.isArray(jv)){
        jv = Array(jv)
    }
    
    const status = [php, py, jv];
    // console.log(status)
    
    // work experience
    let company = dt["company[]"].split(",");
    let designationW = dt["designation[]"].split(",");
    let fromDate = dt["fromdate[]"].split(",");    
    let toDate = dt["enddate[]"].split(",");

    if(!Array.isArray(company)){
        company = Array(company)
    }
    if(!Array.isArray(designationW)){
        designationW = Array(designationW)
    }
    if(!Array.isArray(fromDate)){
        fromDate = Array(fromDate)
    }
    if(!Array.isArray(toDate)){
        toDate = Array(toDate)
    }


    
    // console.log(company, designationW, fromDate, toDate)
   

    // // reference contact
    const rname = dt["rname[]"].split(",");
    const rcontact = dt["rcontact[]"].split(",");
    const rrelation = dt["rrelation[]"].split(",");
   

    

    // prefrence
    const prefLocation = dt.pref_location;
    const noticePeriod = dt.notice_period;
    const expectedCTC = dt.expected_ctc;
    const actualCTC = dt.actual_ctc;
    const department = dt.dept;

    
    
    
    const insertBasicDetails = `INSERT INTO basic_details (first_name, last_name, desingnation, address1, address2, email, city, phone, state, gender, rel_ismarried, dob, zipcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    con.query(insertBasicDetails, [fname, lname, designation, add1, add2, email, city, phone, state, gender, relation, dob, zipcode] , (err, result)=>{
        if(err){
            console.log("failed basic Details")
            // res.send(err) ;
        }else {
            const lastInsertedId = result.insertId;
            console.log("last inserted ID : ", lastInsertedId);            
            console.log("basic Education inserted");
            // console.log(dt);

            // education insertion
            const insertEducation = `INSERT INTO education (course, passing_year, percentage, basic_id) VALUES(?,?,?,?)`;

            if(educationName.length == educationYear.length &&  educationYear.length == educationPercentage.length){
                
                for(let i=0; i<educationName.length; i++){
                    console.log(educationName[i], educationName.length)
                    con.query(insertEducation, [educationName[i], educationYear[i], parseFloat(educationPercentage[i]), lastInsertedId], (err, result)=>{
                        if(err){
                            // res.send(err);
                            console.log("faield eduation");
                            // res.render("onFormSubmit", {message : "Failed :("});
                            // res.end();
                            return;
                        } else {
                            console.log("education inserted");
                        }
                    });
                }
            }

            
            //language insertion
            const insertLanguage = `INSERT INTO language (basic_id, lang_name, lread, lwrite, lspeak) values(?,?,?,?,?)`;
            for(let i=0; i < languages.length; i++){
                con.query(insertLanguage, [lastInsertedId ,languages[i], read[i] == undefined ? read[i] = 0 : read[i] = 1 , write[i] == undefined ? write[i] = 0 : write[i] = 1, speak[i] == undefined ? speak[i] = 0 : speak[i] = 1], (err, result)=>{
                    if(err){
                        // res.send(err);
                        console.log("failed language" + err);

                        // res.render("onFormSubmit", {message : "Failed :("});
                        // res.end();
                        return;
                    } else {
                        console.log("language inserted");
                    }
                });
    
            }
            
    
            // technologies
            const insertTechnologies = `insert into technology (basic_id, technology_name, status) values(?,?,?)`;

            for(let i=0; i<technologies.length; i++){
                con.query(insertTechnologies, [lastInsertedId, technologies[i], status[i]], (err, result)=>{
                    if(err){
                        // res.send(err);
                        console.log("failed Technologies");
                        // res.render("onFormSubmit", {message : "Failed :("});
                        // res.end();
                        return;
                    } else {
                        console.log("technology inserted");
                    }
                })
            }



            // work experience
            
            const insertWorkExperience = `insert into work_experience (basic_id, company, desingation, from_date, to_date) values (?,?,?,?,?)`;
            for(let i=0; i<company.length; i++){
                con.query(insertWorkExperience, [lastInsertedId ,company[i], designationW[i], fromDate[i], toDate[i]], (err, result)=>{
                    if(err){
                        res.send(err);
                        console.log("failed work Experience");
                        // res.render("onFormSubmit", {message : "Failed :("});
                        // res.end();
                        return;
                    } else {
                        console.log("work Experience inserted");
                    }
                })
            }


            // references 
            const insertRefContact = "INSERT INTO ref_contact (basic_id, rfname, refphone, relation) values (?,?,?,?)";
            for(let i=0; i<rname.length; i++){
                con.query(insertRefContact, [lastInsertedId , rname[i], rcontact[i], rrelation[i]], (err, result)=>{
                    if(err){
                        // res.send(err);
                        console.log("failed ref_contact");
                        // res.render("onFormSubmit", {message : "Failed :("});
                        // res.end();
                        return;
                    } else {
                        console.log("ref_contanct inserted");
                    }
                });
            }


            // preferences
            const insertPreference = "INSERT INTO preference (location, notice_period, expected_ctc, current_ctc, department, basic_id) values (?,?,?,?,?,?)";
            
            con.query(insertPreference, [prefLocation, noticePeriod, parseInt(expectedCTC), parseInt(actualCTC), department, lastInsertedId], (err, result)=>{
                if(err){
                    // res.send(err);
                    console.log("failed preference");
                    // res.render("onFormSubmit", {message : "Failed :("});
                    // res.end();
                    return;
                } else {
                    console.log("preference inserted");
                    // res.render("onFormSubmit", {message : "Successfully :)"});
                }
            });        
         
        }
    });

}


module.exports = {addDataG, addData, home};