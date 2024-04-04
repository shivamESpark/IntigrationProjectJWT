const express = require("express");
const routes  = express.Router();
routes.use(express.json());




const wireframeAddData = require("../../controller/wireframeAJAX/wireframeAddData");
routes.get("/", wireframeAddData.home);
routes.get("/addData", wireframeAddData.addDataG);
routes.post("/addData", wireframeAddData.addData);

const wireframeUpdate = require("../../controller/wireframeAJAX/wireframeUpdate");
routes.get("/", wireframeUpdate.home);
routes.get("/db", wireframeUpdate.formDataFeed);
routes.get('/update', wireframeUpdate.update);
routes.post('/update', wireframeUpdate.updateData);


module.exports = routes;