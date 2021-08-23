const express = require('express');
const router = express.Router();
const api = require('../controller/api');
const multer = require('../middleware/multer');
// const authUtil = require('../middleware/authUtil');

//GET API
router.post("/upload", multer.send, api.upload);
router.post("/insert", api.insert);
router.post("/findbyschema", api.findbyschema);
router.post("/validate_logs_sum", api.validate_logs_sum);
router.post("/create", api.create);
router.post("/validate_logs", api.validate_logs);
router.post("/exporttocsv", api.exporttocsv);
router.post("/overwrite", api.overwrite);

module.exports = router;
