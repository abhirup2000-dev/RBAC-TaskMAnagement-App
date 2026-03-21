const express = require('express')
const router = express.Router()


// const empRoutes = require('../routes/empRoute');
const recordRoutes = require('../routes/recordRoute');
// View Routes (EJS pages)
const viewRoutes = require('./empRoute');


// router.use('/emp', empRoutes);

router.use('/records', recordRoutes);

router.use('/', viewRoutes);



module.exports = router