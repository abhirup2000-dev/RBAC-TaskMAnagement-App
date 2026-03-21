const express = require('express');
const router = express.Router();
const RateLimit = require('../utils/limiter')

const empController = require('../controller/empController');
const { setUserFromCookie, requireAuth, authCheckMiddleware } = require('../middleware/middleware');

// Apply setUserFromCookie globally for all view routes
router.use(setUserFromCookie);

// Public pages
router.get('/', empController.viewLogin);
router.get('/admin/view', empController.adminLogin);
router.get('/manager/view', empController.managerLogin);
router.get('/register', empController.viewRegister);


// Auth form handlers
router.post('/auth/login', RateLimit, empController.handleLogin);
router.post('/auth/register', empController.empRegister);
router.post('/logout', empController.logout);


// Protected pages

router.get('/dashboard', requireAuth, authCheckMiddleware, empController.showDashboard);
router.get('/records-view', requireAuth, authCheckMiddleware, empController.showRecords);
router.post('/records-view/create', requireAuth, authCheckMiddleware, empController.CreateRecord);
router.post('/records-view/delete/:id', requireAuth, authCheckMiddleware, empController.DeleteRecord);
router.post('/records-view/update/:id', requireAuth, authCheckMiddleware, empController.UpdateRecord);

module.exports = router;
