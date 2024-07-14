// routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const applicationController = require('../controllers/applicationController');

// Get all events
router.get('/', eventController.getAllEvents);

// Get an event by ID
router.get('/:id', eventController.getEventById);

// Get an event by user 
router.get('/user/:userId', eventController.getEventsByUser);

router.get('/:eventId/applications', applicationController.getEventApplications);

// Get all events created by a specific company
router.get('/company/:companyId', eventController.getEventsByCompany);

// Create a new event
router.post('/', eventController.createEvent);

// Update an event
router.put('/:id', eventController.updateEvent);

// Delete an event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
