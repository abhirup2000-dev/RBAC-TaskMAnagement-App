const express = require('express')
const router = express.Router()


const recordRoutes = require('../routes/recordRoute');
// View Routes (EJS pages)
const empRoutes = require('./empRoute');



router.use('/records', recordRoutes);

router.use('/', empRoutes);



module.exports = router