const jwt = require("jsonwebtoken");
function authentication(req, res, next) {
    const token = req.cookies["access_token"];
    if (!token) {
        return res.sendStatus(403);
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = data.id;
        req.userRole = data.role;
        return next();
    } catch (err){
        return res.sendStatus(403);
    }
};


module.exports = { authentication }