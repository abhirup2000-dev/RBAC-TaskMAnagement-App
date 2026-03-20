const express = require('express');
const router = express.Router();

const recordController = require('../controller/recordController');
const { authMiddleware, authorizePermission } = require('../middleware/middleware');

router.post("/", authMiddleware, authorizePermission('create_record'), recordController.createRecord);
router.get("/", authMiddleware, authorizePermission('read_record'), recordController.getAllRecords);
router.put("/:id", authMiddleware, authorizePermission('update_record'), recordController.updateRecord);
router.delete("/:id", authMiddleware, authorizePermission('delete_record'), recordController.deleteRecord);

module.exports = router;
