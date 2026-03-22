const express = require('express')
const router = express.Router()


const recordRoutes = require('../routes/recordRoute');
// View Routes (EJS pages)
const viewRoutes = require('./empRoute');



router.use('/records', recordRoutes);

router.use('/', viewRoutes);



module.exports = router