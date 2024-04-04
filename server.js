const express = require("express");
const app = express();

const {dbConnect} = require("./dbHandler/dbConnect");
const con = dbConnect();
const md5 = require("md5");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");

const cookieParcer = require("cookie-parser");
app.use(cookieParcer());
app.use(express.json());


const authorization = (req, res, next) => {
    const token = req.cookies["access_token"];
    if(!token){
        return res.sendStatus(403);
    }
    try{
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = data.id;
        req.userRole = data.role;
        return next();
    } catch {
        return res.sendStatus(403);
    }
};



app.get("/", (req, res)=>{
    res.render("index");    
});

const addUser = require("./routes/login/auth");   
app.use("/addUser", addUser);

const createPass = require("./routes/login/createPassword");
app.use("/loginpass", createPass);

const login = require("./routes/login/login");
app.use("/login", login);


app.get("/home", authorization, (req, res)=>{
    res.render("./login/home");
});


const dynamicTable = require("./routes/dynamicTable/dynamicTable"); 
app.use("/dynamic", authorization, dynamicTable);

const eventsTable = require("./routes/eventsTable/eventsTable");
app.use("/events", authorization, eventsTable);

const kukuCube = require("./routes/kukuCube/kukuCube");
app.use("/kukucube", authorization, kukuCube);

const tickTackToe = require("./routes/tickTackToe/tickTackToe");
app.use("/tickTacToe", authorization, tickTackToe);

const delimeterSearch = require("./routes/delimeterSearch/delimeterSearch");
app.use("/delimetersearch", authorization, delimeterSearch);

const dynamicGried = require("./routes/dynamicGrid/dynamicGrid");
app.use("/dynamicgrid", authorization, dynamicGried);

const studentPageURL = require("./routes/studentSortingPagingURL/studentPaging");
app.use("/studentURL", authorization, studentPageURL);

const wireFrameAJAX = require("./routes/wireframeAJAX/wireframAJAX");
app.use("/wireframeajax", authorization, wireFrameAJAX);

const wireframCRUD = require("./routes/wireframeCRUD/wireframCRUD");
app.use("/wireframecrud", authorization, wireframCRUD);

const studentResult = require("./routes/studentResult/studentResult");
app.use("/studentresult", authorization, studentResult);

const timezone = require("./routes/timezone/timezone");
app.use("/timezone", authorization, timezone);


const dynamicComponent = require("./routes/dynamicComponent/dynamicComponent");
app.use("/component", authorization, dynamicComponent);


const frontPagePagination = require("./routes/frontEndPagination/frontEndPagination");
app.use("/frontendpagination", authorization, frontPagePagination);


// for logout
app.get("/logout", authorization, (req, res)=>{
    return res.clearCookie("access_token").status(200).render("./login/login.ejs");
});




app.listen(8080)



