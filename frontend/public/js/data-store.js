class EventStore {
    constructor() {
        console.log('EventStore initializing...');
        this.events = []; // Initialize as empty array FIRST
        this.loadFromStorage(); // Then load from storage
        console.log('EventStore initialized with', this.events.length, 'events');
    }

    // Get all approved events
    getApprovedEvents() {
        return this.events.filter(event => event && event.status === 'approved');
    }

    // Get pending events
    getPendingEvents() {
        return this.events.filter(event => event && event.status === 'pending');
    }

    // Get all events
    getAllEvents() {
        return this.events || [];
    }

    // Get event by ID
    getEventById(id) {
        return this.events.find(event => event && event.id === id);
    }



    // Add this method to EventStore class
deleteEvent(eventId) {
    console.log('Deleting event:', eventId);
    
    try {
        // Find event index
        const eventIndex = this.events.findIndex(e => e && e.id === eventId);
        
        if (eventIndex === -1) {
            console.error('Event not found:', eventId);
            return false;
        }
        
        // Store deleted event info for logging
        const deletedEvent = this.events[eventIndex];
        
        // Remove from array
        this.events.splice(eventIndex, 1);
        
        // Save to storage
        this.saveToStorage();
        
        // Trigger update
        this.triggerUpdate();
        
        // Log deletion (for admin audit)
        console.log('Event deleted:', deletedEvent.title);
        
        // Optional: Save to deleted events log
        let deletedLog = JSON.parse(localStorage.getItem('deleted_events') || '[]');
        deletedLog.push({
            ...deletedEvent,
            deletedAt: new Date().toISOString(),
            deletedBy: currentUser?.email || 'admin'
        });
        localStorage.setItem('deleted_events', JSON.stringify(deletedLog));
        
        return true;
        
    } catch (error) {
        console.error('Error deleting event:', error);
        return false;
    }
}

    // Submit new event
    submitEvent(eventData) {
        console.log('Submitting event with data:', eventData);
        
        try {
            // Validate required fields
            if (!eventData || !eventData.title || !eventData.description || !eventData.date) {
                console.error('Missing required fields:', eventData);
                throw new Error('Missing required fields');
            }
            
            // Ensure events array exists
            if (!this.events) {
                this.events = [];
            }
            
            const newEvent = {
                id: Date.now().toString(),
                ...eventData,
                registeredCount: 0,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };
            
            console.log('Created new event:', newEvent);
            
            // Push to array
            this.events.push(newEvent);
            console.log('Event pushed. Total events:', this.events.length);
            
            // Save to storage
            this.saveToStorage();
            
            // Trigger update
            this.triggerUpdate();
            
            console.log('Event saved successfully');
            return newEvent;
            
        } catch (error) {
            console.error('Error in submitEvent:', error);
            throw error;
        }
    }

    // ===== NEW METHOD: Update existing event =====
    updateEvent(eventId, updatedData) {
        console.log('Updating event:', eventId, 'with data:', updatedData);
        
        try {
            // Find the event index
            const eventIndex = this.events.findIndex(e => e && e.id === eventId);
            if (eventIndex === -1) {
                console.error('Event not found:', eventId);
                return false;
            }
            
            const oldEvent = this.events[eventIndex];
            
            // If event was approved, set back to pending for re-approval
            // If it was pending, keep pending
            // If it was rejected, keep rejected (they can edit and resubmit)
            let newStatus = oldEvent.status;
            let statusMessage = '';
            
            if (oldEvent.status === 'approved') {
                newStatus = 'pending';
                statusMessage = 'Event was approved, now needs re-approval';
            } else if (oldEvent.status === 'rejected') {
                newStatus = 'pending'; // Rejected events become pending again when edited
                statusMessage = 'Event resubmitted for approval';
            }
            
            // Create updated event
            this.events[eventIndex] = {
                ...oldEvent,
                ...updatedData,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                previousStatus: oldEvent.status, // Store original status
                updateHistory: [
                    ...(oldEvent.updateHistory || []),
                    {
                        from: oldEvent.status,
                        to: newStatus,
                        at: new Date().toISOString()
                    }
                ]
            };
            
            console.log('Event updated:', this.events[eventIndex]);
            console.log('Status changed from', oldEvent.status, 'to', newStatus, '-', statusMessage);
            
            // Save to storage
            this.saveToStorage();
            
            // Trigger update
            this.triggerUpdate();
            
            return true;
            
        } catch (error) {
            console.error('Error in updateEvent:', error);
            return false;
        }
    }

    // Approve event
    approveEvent(eventId) {
        const event = this.events.find(e => e && e.id === eventId);
        if (event) {
            event.status = 'approved';
            event.approvedAt = new Date().toISOString();
            this.saveToStorage();
            this.triggerUpdate();
            return true;
        }
        return false;
    }

    // Reject event
    rejectEvent(eventId, reason) {
        const event = this.events.find(e => e && e.id === eventId);
        if (event) {
            event.status = 'rejected';
            event.rejectionReason = reason;
            event.rejectedAt = new Date().toISOString();
            this.saveToStorage();
            this.triggerUpdate();
            return true;
        }
        return false;
    }

    // Save to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('campusconnect_events', JSON.stringify(this.events));
            console.log('Saved to storage:', this.events.length, 'events');
        } catch (e) {
            console.error('Error saving to storage:', e);
        }
    }

    // Load from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('campusconnect_events');
            if (stored) {
                this.events = JSON.parse(stored);
                console.log('Loaded from storage:', this.events.length, 'events');
            } else {
                console.log('No stored events found');
            }
        } catch (e) {
            console.error('Error loading from storage:', e);
            this.events = []; // Reset to empty array on error
        }
    }

    // Trigger update event
    triggerUpdate() {
        window.dispatchEvent(new CustomEvent('eventsUpdated'));
    }
}

// Create global instance
console.log('Creating EventStore instance...');
const eventStore = new EventStore();
window.eventStore = eventStore; // Make it globally available
console.log('EventStore instance created:', eventStore);


