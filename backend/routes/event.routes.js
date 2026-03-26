// backend/routes/event.routes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

// GET all events
router.get('/', eventController.getAllEvents);

// GET single event
router.get('/:id', eventController.getEventById);

// POST create new event
router.post('/', eventController.createEvent);

// POST register for event
router.post('/:id/register', eventController.registerForEvent);

// PUT update event
router.put('/:id', eventController.updateEvent);

// DELETE event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;