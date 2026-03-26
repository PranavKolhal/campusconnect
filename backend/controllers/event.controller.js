// backend/controllers/event.controller.js

// Mock database (replace with real database later)
let events = [
  {
    id: '1',
    title: 'National Hackathon 2024',
    type: 'hackathon',
    description: 'Join the biggest hackathon in India!',
    organizer: 'Tech Community',
    date: '2024-04-15',
    location: 'Bangalore',
    registeredCount: 45,
    maxRegistrations: 100,
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Startup Pitching Lab',
    type: 'pitching-lab',
    description: 'Pitch your startup idea to investors',
    organizer: 'Startup Hub',
    date: '2024-05-20',
    location: 'Mumbai',
    registeredCount: 23,
    maxRegistrations: 50,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'AI Workshop',
    type: 'workshop',
    description: 'Learn AI and Machine Learning from experts',
    organizer: 'AI Institute',
    date: '2024-06-10',
    location: 'Online',
    registeredCount: 78,
    maxRegistrations: 200,
    status: 'upcoming'
  }
];

// Get all events
exports.getAllEvents = (req, res) => {
  try {
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events'
    });
  }
};

// Get single event by ID
exports.getEventById = (req, res) => {
  try {
    const eventId = req.params.id;
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event'
    });
  }
};

// Create new event
exports.createEvent = (req, res) => {
  try {
    const { title, type, description, organizer, date, location, maxRegistrations } = req.body;
    
    // Basic validation
    if (!title || !type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, type and description'
      });
    }
    
    const newEvent = {
      id: Date.now().toString(),
      title,
      type,
      description,
      organizer: organizer || 'Unknown Organizer',
      date: date || new Date().toISOString().split('T')[0],
      location: location || 'TBD',
      registeredCount: 0,
      maxRegistrations: maxRegistrations || 100,
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event'
    });
  }
};

// Register for event
exports.registerForEvent = (req, res) => {
  try {
    const eventId = req.params.id;
    const { name, email, teamName } = req.body;
    
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    if (event.registeredCount >= event.maxRegistrations) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }
    
    // Increment registration count
    event.registeredCount += 1;
    
    res.json({
      success: true,
      message: 'Successfully registered for event',
      data: {
        eventId: event.id,
        eventTitle: event.title,
        name,
        email,
        teamName: teamName || null,
        registrationId: 'REG_' + Date.now()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering for event'
    });
  }
};

// Update event
exports.updateEvent = (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Update event
    events[eventIndex] = { ...events[eventIndex], ...updates };
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      data: events[eventIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event'
    });
  }
};

// Delete event
exports.deleteEvent = (req, res) => {
  try {
    const eventId = req.params.id;
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Remove event
    events.splice(eventIndex, 1);
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event'
    });
  }
};