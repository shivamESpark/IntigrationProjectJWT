const express = require("express");
const routes  = express.Router();
const url = require("url");
const bodyParser = require("body-parser");
const {dbConnect} = require("../../dbHandler/dbConnect");
const con = dbConnect();





routes.get("/:id/:month", (req, res)=>{
    // http://localhost:8080/1/12/
    let pid = req.params.id;
    
    const baseUrl = url.parse(req.url, true);   
    let month = baseUrl.query.mn;
    let field = baseUrl.query.field;
    let order = baseUrl.query.order;

    console.log("field ", field);
    console.log("order ", order);

    month == undefined ? month = 12 : "";
    field == undefined ? field = "student_id" : "";
    order == undefined ? order = "asc" : "";

    console.log(month);
    // console.log(month);

    // const fieldname = req.params.field;
    // const sort = req.params.sorder;
    // console.log(fieldname);
    // console.log(sort);

    console.log("trying to connect with db ~~<  =[]");
    con.connect(()=>{
        try{
            // http://localhost:8080/1
            
            month == undefined ? month = 1 : month;

            console.log("connected --<=[]");
            console.log("fetching record");
            // let month = 12;
            const qry1 = `select a.student_id, s.fname, sum(a.attendace) as aday, truncate(sum(a.attendace)*100/count(a.attendace),2) as percentage 
            from attendance as a
            left join
            student2 as s on a.student_id = s.sid where month(a_date) = ${month} group by a.student_id, s.fname order by ${field} ${order} `
            
            if(pid == undefined){
                pid = 1;
            }

            const qry = `select student_id, sum(attendace) as adays, truncate(sum(attendace)*100/count(attendace),2) as percentage from attendance where month(a_date) = ${month} group by student_id `
            con.query(qry1 + `limit ${(+pid-1)*15},15`, (err, result, fields)=>{
                if(!err){
                    console.log("record has been fetched");
                    res.render('./studentResult/attendance', {pid:pid, result:result, month:month, field:field, order:order});
                } else {
                    console.log("error=>" + err);
                }
            });
        } catch(err){
            console.log(err);
        }
    });
});



routes.get("/result", (req, res)=>{
    console.log("result");
    const baseUrl = url.parse(req.url, true);
    const pid = baseUrl.query.pid;
    console.log(pid);

    con.connect(()=>{
        const qry3 = `SELECT 
            s.sid as sid,
            s.fname as fname,
            s.lname as lname,
            t.tmarks as ttmarks,
            t.pmarks as tpmarks,
            i.itmarks as itmarks,
            i.ipmarks as ipmarks,
            f.ftmarks as ftmarks,
            f.fpmarks as fpmarks
        FROM
            student2 AS s
                JOIN
            (SELECT 
                s.sid AS sid,
                    SUM(t.marks_t_40) AS tmarks,
                    SUM(t.marks_p_10) AS pmarks
            FROM
                student2 AS s
            JOIN terminal_exam AS t ON t.student_id = s.sid
            GROUP BY s.sid) AS t ON t.sid = s.sid
                JOIN
            (SELECT 
                s.sid AS sid,
                    SUM(i.marks_t_40) AS itmarks,
                    SUM(i.marks_p_10) AS ipmarks
            FROM
                student2 AS s
            JOIN interim_exam AS i ON s.sid = i.student_id
            GROUP BY s.sid) AS i ON i.sid = s.sid
                JOIN
            (SELECT 
                s.sid AS sid,
                    SUM(f.marks_t_80) AS ftmarks,
                    SUM(f.marks_p_20) AS fpmarks
            FROM
                student2 AS s
            JOIN final_exam AS f ON f.student_id = s.sid
            GROUP BY s.sid) AS f ON f.sid = s.sid
        GROUP BY s.sid `

        const qry = "select s.sid as sid, s.fname as fname, s.lname as lname, b.subject_name as subject, f.marks_t_80 as tmarks, f.marks_p_20 as pmarks from student2 as s join final_exam as f on s.sid = f.student_id right join subject_master as b on b.subject_id = f.subject_id order by s.sid "
        
        const qry2 = "select s.sid as sid, s.fname as fname, s.lname as lname, sum(t.marks_t_40) as tmarks, sum(t.marks_p_10) as pmarks from student2 as s join terminal_exam as t on s.sid = t.student_id group by sid "



        con.query(qry3 + `limit ${(+pid-1)*15},15`, (err, result, fields)=>{
            if(!err){
                res.render("./studentResult/result", {pid:pid, result:result});
            }
        });
    });
    
    
});


routes.get("/detailed", (req, res)=>{
    const baseUrl = url.parse(req.url, true);
    const sid = baseUrl.query.sid;
    const pid = baseUrl.query.pid;
    const fname = baseUrl.query.fname;
    const lname = baseUrl.query.lname;
    console.log("pid" ,pid);

    const sql = 
    `select s.subject_name as subject, s.subject_code as scode, f.marks_t_80 as ftmarks, f.marks_p_20 as fpmarks from final_exam as f join subject_master as s on s.subject_id = f.subject_id where student_id = ${sid}; 
    select s.subject_name as subject, s.subject_code as scode, i.marks_t_40 as ftmarks, i.marks_p_10 as fpmarks from interim_exam as i join subject_master as s on s.subject_id = i.subject_id where student_id = ${sid};
    select s.subject_name as subject, s.subject_code as scode, t.marks_t_40 as ftmarks, t.marks_p_10 as fpmarks from terminal_exam as t join subject_master as s on s.subject_id = t.subject_id where student_id = ${sid};`;

    con.query(sql, [1,2,3], (err, result, fields)=>{
        if(!err){
            res.render("./studentResult/detailed", {sid:sid, fname:fname, lname:lname, result:result[0], tresult:result[1], iresult:result[2], pid:pid});
        } else {
            console.log("error => " + err);
        }
    });
});


//===================================================================================================================================================================
// serach route


routes.get("/search", (req, res)=>{
    console.log("search");
    const baseUrl = url.parse(req.url, true);
    const pid = baseUrl.query.pid;
    let sid = baseUrl.query.sid;


    let fname = baseUrl.query.fname;
    let lname = baseUrl.query.lname;
    let course = baseUrl.query.course;
    let email = baseUrl.query.email;
    let phone = baseUrl.query.phone;
    let mode = baseUrl.query.mode;

    // console.log(fname, lname, course, email, phone, mode)


    // console.log(pid);

    if(sid == undefined){
        sid = false;
    }

    // assining some value
    fname == undefined ? fname = null : fname;
    lname == undefined ? lname = null : lname;
    course == undefined ? course = null : course;
    email == undefined ? email = null : email;
    phone == undefined ? phone = null : phone;

    let Gqry = null;
    let q1 = null;
    let nPage = 1;
    if(sid != undefined || sid != null){
        Gqry = `select * from student2 where sid = ${sid} `;
        q1 = Gqry;
    }   
    if(fname != undefined || mode!=undefined || lname != undefined || course != undefined || email!= undefined || phone != undefined){
    //    Gqry = `select * from student2 where fname like '${fname}%' ${mode} lname like '${lname}%' ${mode} course like '%${course}%' ${mode} email like '${email}%' ${mode} phone like '${phone}%' limit ${(+pid-1)*15},15`;
    //    q1 = `select * from student2 where fname like '${fname}%' ${mode} lname like '${lname}%' ${mode} course like '%${course}%' ${mode} email like '${email}%' ${mode} phone like '${phone}%'`;

        Gqry= `select * from student2 where fname like '${fname!=undefined ? fname : fname = false}%' ${mode} lname like '${ lname !=undefined ? lname : lname=false }%' ${mode} course like '${course != undefined ? course : course = false}%' ${mode} email like '${email !=undefined ? email : email = false}%' ${mode} phone like '${phone != undefined ? phone : phone=false}%' limit ${(+pid -1)*15},15`;
        // Gqry = `select * from student2 where fname like ${fname ? `${fname}%` : 'FALSE'} ${mode} lname like ${lname ? `${lname}%` : 'FALSE'} ${mode} course like ${course ? `${course}%` : 'FALSE'} ${mode} email like ${email ? `${email}%` : 'FALSE'} ${mode} phone like ${phone ? `${phone}%` : 'FALSE'}`;
        // Gqry = `select * from student2 where fname where fname = ${fname} or lname = ${lname} or course = ${course} `
    }
    
    // console.log(Gqry)

    con.connect(()=>{        
        
        // let qry1 = `select * from student2 where sid = ${sid} `;
        // let qry2 = `select * from student2 where fname like '%${fname}%' ${mode}`
        // let qry2 =  `select * from student where fname = ${fname} ${mode} lname=${lname} ${mode} course=${course} ${mode} email=${email} ${mode} phone=${phone}`;
        console.log(Gqry)
        // `limit ${(+pid-1)*15},15`
        
        con.query(`${q1};${Gqry}`,[1,2], (err, result, fields)=>{
            if(!err){
                // console.log(result)
                let nResult = result[0].length;
                nPage = Math.round(nResult/15);
                res.render("./studentResult/studentSearch", {pid:pid, result:result[1], field:fields[1], fname:fname, lname:lname, course:course, email:email, phone:phone, sid:sid, mode:mode, nPage:nPage});
            } else {
                res.render("./studentResult/studentSearch", {pid:pid, result:undefined, field:undefined, err:err, nPage:nPage});
            }
        });
        
    });    
    
});


module.exports = routes;
// ==================================================================================================================================================================================