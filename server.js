const express = require("express");
const app = express();

const bycrpt = require("bcrypt");
const {dbConnect} = require("./dbHandler/dbConnect");
const con = dbConnect();
const md5 = require("md5");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");

const cookieParcer = require("cookie-parser");
app.use(cookieParcer());
app.use(express.json());


app.get("/", (req, res)=>{
    res.render("index");    
});

const addUser = require("./routes/auth");
app.use("/addUser", addUser);

const createPass = require("./routes/createPassword");
app.use("/loginpass", createPass);

// jwt
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

const login = require("./routes/login");
app.use("/login", login);


app.get("/home", authorization, (req, res)=>{
    res.render("home");
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
app.use("/dynamicgrid", dynamicGried);

const studentPageURL = require("./routes/studentSortingPagingURL/studentPaging");
app.use("/studentURL", studentPageURL);

const wireFrameAJAX = require("./routes/wireframeAJAX/wireframAJAX");
app.use("/wireframeajax", wireFrameAJAX);

app.get("/logout", authorization, (req, res)=>{
    return res.clearCookie("access_token").status(200).json({message:"successfully logout"});
})








app.listen(8080)