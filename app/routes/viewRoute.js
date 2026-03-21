const express = require('express');
const router = express.Router();
const RateLimit = require('../utils/limiter')

const viewController = require('../controller/viewController');
const { setUserFromCookie, requireAuth } = require('../middleware/middleware');

// Apply setUserFromCookie globally for all view routes
router.use(setUserFromCookie);

// Public pages
router.get('/', viewController.viewLogin);
router.get('/register', viewController.viewRegister);


// Auth form handlers
router.post('/auth/login', RateLimit, viewController.handleLogin);
router.post('/auth/register', viewController.empRegister);
router.post('/logout', viewController.logout);


// Protected pages
router.get('/dashboard', requireAuth, viewController.showDashboard);
router.get('/records-view', requireAuth, viewController.showRecords);
router.post('/records-view/create', requireAuth, viewController.CreateRecord);
router.post('/records-view/delete/:id', requireAuth, viewController.DeleteRecord);
router.post('/records-view/update/:id', requireAuth, viewController.UpdateRecord);

module.exports = router;
