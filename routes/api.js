const express = require('express');
const router = express.Router();
const api = require('../controller/api');
const multer = require('../modules/multer');

router.post("/upload", multer.send, api.upload);
router.post("/insert", api.insert);
router.post("/findbyschema", api.findbyschema);
router.post("/validatelogssum", api.validatelogssum);
router.post("/create", api.create);
router.post("/validatelogslist", api.validatelogslist);
router.post("/exporttocsv", api.exporttocsv);
router.post("/overwrite", api.overwrite);
router.post("/distinct", api.distinct);
router.post("/getranks", api.getranks);

module.exports = router;
