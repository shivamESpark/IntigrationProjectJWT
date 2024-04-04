const express = require("express");
const routes  = express.Router();



const wireframeAddData = require("../../controller/wireframeCRUD/wireFrameAddData");
routes.get("/", wireframeAddData.home)
routes.get("/addData", wireframeAddData.addDataG);
routes.post("/addData", wireframeAddData.addData);



const wireFrameUpdate = require("../../controller/wireframeCRUD/wireFrameUpdate");
routes.get("/db", wireFrameUpdate.formDataFeed);
routes.get('/update', wireFrameUpdate.updateG);
routes.post('/update', wireFrameUpdate.updates);




module.exports = routes;