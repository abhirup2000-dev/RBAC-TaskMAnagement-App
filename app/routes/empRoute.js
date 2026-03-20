const express = require('express');
const router = express.Router();

const employeeController = require('../controller/empController');
const { authMiddleware, authorizePermission } = require('../middleware/middleware');

router.post("/register", employeeController.createEmployee);
router.post("/login", employeeController.loginEmployee);

//protected routes
router.use(authMiddleware)

router.get("/all", authorizePermission('delete_record'), employeeController.getAllEmployees);

router.put("/update/:id", authorizePermission('update_record'), employeeController.updateEmployee);
router.delete("/delete/:id", authorizePermission('delete_record'), employeeController.deleteEmployee);

module.exports = router;