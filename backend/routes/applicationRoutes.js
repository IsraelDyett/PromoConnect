const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// Get all applications
router.get('/', applicationController.getAllApplications);

// Get application by ID
router.get('/:id', applicationController.getApplicationById);

// Get application by user ID
router.get('/user/:userId', applicationController.getApplicationByUser);

// Create a new application
router.post('/', applicationController.createApplication);

// Update an application
router.put('/:id', applicationController.updateApplication);

// Delete an application
router.delete('/:id', applicationController.deleteApplication);

// Update the status of an application '/applications/:applicationId/status'
router.patch('/:applicationId/status', applicationController.updateStatus);



module.exports = router;
