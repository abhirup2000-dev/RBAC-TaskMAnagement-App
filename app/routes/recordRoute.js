const express = require('express');
const router = express.Router();

const recordController = require('../controller/recordController');
const { authCheckMiddleware, authorizePermission } = require('../middleware/middleware');


router.use(authCheckMiddleware)
router.post("/", authorizePermission('create_record'), recordController.createRecord);
router.get("/", authorizePermission('read_record'), recordController.getAllRecords);
router.put("/:id", authorizePermission('update_record'), recordController.updateRecord);
router.delete("/:id", authorizePermission('delete_record'), recordController.deleteRecord);

module.exports = router;
