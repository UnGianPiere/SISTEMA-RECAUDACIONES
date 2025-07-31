const express = require('express');
const router = express.Router();
const backupController= require("../controllers/backupController")

router.get("/",backupController.generarBackup)

module.exports = router;
