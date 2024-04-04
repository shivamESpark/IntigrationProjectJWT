const url = require("url");
const bodyParser = require("body-parser");
const {dbConnect} = require("../../dbHandler/dbConnect");
const con = dbConnect();






const formDataFeed = (req, res)=>{
    const id = req.query.id;
    // const tableName = req.query.table;
    const sqlBasicAll = `select * from basic_details`
    const sqlBasic = `select id, first_name as fname, last_name as lname, desingnation as designation, address1, address2, email, city, phone, dob, zipcode, state, rel_ismarried as relation, gender as gender from basic_details where id=${id}`;
    
    const sqlEducaion = `select bid as eid, course, passing_year, percentage from education where basic_id=${id}`;

    const sqlLanguage = `select lid, lang_name, lread, lwrite, lspeak from language where basic_id=${id}`;
    const sqlTechnology = `select tid,technology_name, status from technology where basic_id=${id}`;
    const sqlReference =  `select rid, rfname, refphone, relation from ref_contact where basic_id=${id}`;
    const sqlPreference =  `select location, notice_period, expected_ctc, current_ctc, department  from preference where basic_id=${id}`;
    const sqlWorkExperience =  `select id as wid, company, desingation, from_date, to_date from work_experience where basic_id=${id}`;

    sql = `${sqlBasic};${sqlEducaion};${sqlLanguage};${sqlTechnology};${sqlWorkExperience};${sqlReference};${sqlPreference};${sqlBasicAll};`
    
    con.query(sql, [1,2,3,4,5,6,7,8], (err, result, field)=>{
        if(err){
            res.send(err);
        } else { 
            res.json([result[0], result[1], result[2], result[3], result[4], result[5], result[6], result[7]]);
            // console.log([result[0], result[1], result[2], result[3], result[4], result[5], result[6]]);
        }
    })
}


const home = (req, res)=>{
    res.render("./wireFrameAJAX/home");
}


const update = (req, res) => {
    const basic_id = req.query.id;
    res.render("./wireFrameAJAX/index", {formType:"Update", userid : basic_id});
    console.log(basic_id);
}


const updateData = (req, res) => {

    const dt = req.body;

    console.log(req.body)

    // update basic details 
    const updateBasicSQL = `update basic_details set first_name = "${dt.fname}", last_name = "${dt.lname}", desingnation = "${dt.desingnation}", address1 = "${dt.address1}", address2 = "${dt.address2}", email = "${dt.email}", city = "${dt.city}", phone = "${dt.phone}", state = "${dt.state}", gender = "${dt.gender}", rel_ismarried = ${parseInt(dt.relation)}, dob = "${dt.dob}", zipcode = "${dt.zipcode}" where id = ${dt.id}`;
    
    con.query(updateBasicSQL, (err, result)=>{
        if(err){
            console.log("update basic field error : ", err);
        } else {
            console.log("Basic Field Updated!");
        }
    })
    // update basic details

    // update education
    let eduID = dt["eid"].split(","); // arrr
    let educationName = dt["education[]"].split(","); // arr
    let educationYear = dt["educationYear[]"].split(",") // arr
    let educationPercentage = dt["educationPercentage[]"].split(",") //arr


    if(!Array.isArray(eduID)){
        eduID = Array(eduID);
    }
    if(!Array.isArray(educationName)){
        educationName = Array(educationName);
    }
    if(!Array.isArray(educationYear)){
        educationYear = Array(educationYear);
    }
    if(!Array.isArray(educationPercentage)){
        educationPercentage = Array(educationPercentage);
    }
    // console.log( eduID,educationName, educationYear, educationPercentage);
    // const deleteEdu = `delete  * from education where basic_id = ${dt.id}`;
    
    const updateEducation = `update education set course = ?, passing_year = ?, percentage = ? where basic_id = ? and bid = ?`;
    

    if(educationName.length == educationYear.length &&  educationYear.length == educationPercentage.length){        
        for(let i=0; i<educationName.length; i++){
            if(eduID[i] == eduID[i+1]){
                const  insertEducation = `INSERT INTO education (course, passing_year, percentage, basic_id) VALUES(?,?,?,?)`;
                console.log("IEDU" + educationName[i], educationName.length)
                con.query(insertEducation, [educationName[i], educationYear[i], parseFloat(educationPercentage[i]), dt.id], (err, result)=>{
                    if(err){
                        console.log("faield eduation");
                        return;
                    } else {
                        console.log("updated education inserted");
                    }
                });
            }
            con.query(updateEducation, [educationName[i], educationYear[i], parseFloat(educationPercentage[i]), dt.id, eduID[i]], (err, result)=>{
                if(err){
                    console.log("update education failed : "+ err);
                    return;
                } else {
                    // console.log(updateEducation);
                    console.log("education updated");
                }
            });
        }
    }
    // education update over with existing field mistake

    // update languages 
    let languages = dt["language[]"].split(",");
    let lid = dt.lid.split(",");
    let read = dt["read[]"].split(",");
    let write = dt['write[]'].split(",");
    let speak = dt['speak[]'].split(",");
    console.log("lang = ", languages,read, write, speak)
    // if not array while returning single value
    if(!Array.isArray(languages)){
        languages = Array(languages)
    }
    if(!Array.isArray(lid)){
        lid = Array(lid);
    }
    if(!Array.isArray(read)){
        read = Array(read);
    }
    if(!Array.isArray(write)){
        write = Array(write);
    }
    if(!Array.isArray(speak)){
        speak = Array(speak);
    }

    // while there is no field selected
    if(languages[0] == undefined){
        languages[0] = 'English';
    }


    //language insertion
    const insertLanguage = `INSERT INTO language (basic_id, lang_name, lread, lwrite, lspeak) values(?,?,?,?,?)`;
    const updateLanguage = `update language set lang_name = ?, lread = ?, lwrite = ?, lspeak = ? where basic_id = ? and lang_name = ?`;
    
    for(let i=0; i < languages.length; i++){
        if(lid[i] == undefined || lid[i] == "" || lid[i] == null){
            con.query(insertLanguage, [dt.id ,languages[i], read[i] == undefined ? read[i] = 0 : read[i] = 1 , write[i] == undefined ? write[i] = 0 : write[i] = 1, speak[i] == undefined ? speak[i] = 0 : speak[i] = 1], (err, result)=>{
                if(err){
                    console.log("failed language" + err);
                    return;
                } else {
                    console.log("language inserted");
                }
            });

        }
        con.query(updateLanguage, [languages[i], read[i] == undefined ? read[i] = 0 : read[i] = 1 , write[i] == undefined ? write[i] = 0 : write[i] = 1, speak[i] == undefined ? speak[i] = 0 : speak[i] = 1, dt.id, languages[i]], (err, result)=>{
            if(err){
                console.log("failed language" + err);
                return;
            } else {
                    console.log("language updated");
            }
        });
    }
    


    // update languages over


    // update technologies
    let technologies = dt["technologies[]"].split(",");
    let php = dt.php;
    let py = dt.python;
    let jv = dt.java;
    let tid = dt.tid.split(",");
    console.log("technology = ", technologies, dt.php, dt.python, dt.java);
    

    if(!Array.isArray(tid)){
        tid = Array(tid)
    }
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

    const insertTechnologies = `insert into technology (basic_id, technology_name, status) values(?,?,?)`;
    const updateTechnology = `update technology set technology_name = ?, status = ?  where basic_id = ? and technology_name = ?`;

    for(let i=0; i<technologies.length; i++){
        console.log("tid" + tid[i])
        if(tid[i] == undefined || tid[i] == "" || tid[i] == null){
            con.query(insertTechnologies, [dt.id, technologies[i], status[i]], (err, result)=>{
                if(err){
                    console.log("failed Technologies");
                    return;
                } else {
                    console.log("technology inserted");
                }
            })
        }
        
        con.query(updateTechnology, [technologies[i], status[i], dt.id, technologies[i]], (err, result)=>{
            if(err){
                console.log("failed Technologies" + err);
                return;
            } else {
                console.log("technology updated");
            }
        })
    }
    // update technologies over

    // update work experience

    let company = dt["company[]"].split(",");
    let designationW = dt["designation[]"].split(",");
    let fromDate = dt["fromdate[]"].split(",");    
    let toDate = dt["enddate[]"].split(",");
    let wid = dt['wid'].split(",");
    console.log(wid);
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
    const updateWorkExperience = `update work_experience set  company = ?, desingation = ?, from_date = ?, to_date = ? where basic_id = ? and id = ?`;
    const insertWorkExperience = `insert into work_experience (basic_id, company, desingation, from_date, to_date) values (?,?,?,?,?)`;
    for(let i=0; i<company.length; i++){
        if(wid[i] == wid[i+1]){
            con.query(insertWorkExperience, [dt.id ,company[i], designationW[i], fromDate[i], toDate[i]], (err, result)=>{
                if(err){
                    res.send(err);
                    console.log("failed work Experience");
                    return;
                } else {
                    console.log("work Experience inserted");
                }
            })
        }
        console.log(company[i], designationW[i], fromDate[i], toDate[i], dt.id, dt.wid[i+1]);
        con.query(updateWorkExperience, [company[i], designationW[i], fromDate[i], toDate[i], dt.id, wid[i]], (err, result)=>{
            if(err){
                res.send(err);
                console.log("failed work Experience");
                return;
            } else {
                console.log("work Experience updated");
            }
        })
    }
    // update work experience over


    // update reference
    // // reference contact
    const rname = dt["rname[]"].split(",");
    const rcontact = dt["rcontact[]"].split(",");
    const rrelation = dt["rrelation[]"].split(",");
    const rid = dt.rid.split(",");
    const updateReference = `update ref_contact set rfname = ? , refphone = ? , relation = ?  where basic_id = ? and rid = ?`;

    for(let i=0; i<rname.length; i++){
        con.query(updateReference, [rname[i], rcontact[i], rrelation[i], dt.id, rid[i]], (err, result)=>{
            if(err){
                console.log("reference error : "+ err);
                return;
            } else {
                console.log("refereces updated");
            }
        })
    }
    // update reference

    // update preference
    const updatePrefernce = `update preference set location = "${dt.pref_location}", notice_period = "${dt.notice_period}", expected_ctc = ${parseInt(dt.expected_ctc)}, current_ctc = ${parseInt(dt.actual_ctc)}, department = "${dt.dept}" where basic_id=${dt.id}`;
    con.query(updatePrefernce, (err, result)=>{
        if(err){
            console.log("preference error : "+ err);
            return;
        } else {
            console.log("prefereces updated");
        }
    });
    // update preference over
}



module.exports = {update, updateData, formDataFeed, home}