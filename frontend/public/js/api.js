// frontend/public/js/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Generic fetch function with error handling
async function apiCall(endpoint, options = {}) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API call failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth APIs
async function login(email, password) {
    return apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

async function register(userData) {
    return apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

async function getCurrentUser() {
    return apiCall('/auth/me');
}

// Event APIs
async function getEvents() {
    return apiCall('/events');
}

async function getEvent(id) {
    return apiCall(`/events/${id}`);
}

async function createEvent(eventData) {
    return apiCall('/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
    });
}

async function registerForEvent(eventId, registrationData) {
    return apiCall(`/events/${eventId}/register`, {
        method: 'POST',
        body: JSON.stringify(registrationData)
    });
}

// Admin APIs
async function getAdminDashboard() {
    return apiCall('/admin/dashboard');
}

async function getAdminEvents() {
    return apiCall('/admin/events');
}

async function getAdminUsers() {
    return apiCall('/admin/users');
}

async function getVerifications() {
    return apiCall('/admin/verifications');
}

async function verifyOrganizer(userId) {
    return apiCall(`/admin/verify/${userId}`, {
        method: 'POST'
    });
}

async function getRevenueReport() {
    return apiCall('/admin/reports/revenue');
}





// Add to existing api.js

// Submit event (pending approval)
async function submitEvent(eventData) {
    return apiCall('/events/submit', {
        method: 'POST',
        body: JSON.stringify({
            ...eventData,
            status: 'pending', // Important: not 'upcoming' yet!
            submittedAt: new Date().toISOString()
        })
    });
}

// Get pending events (admin only)
async function getPendingEvents() {
    return apiCall('/admin/events/pending');
}

// Approve event (admin only)
async function approveEvent(eventId) {
    return apiCall(`/admin/events/${eventId}/approve`, {
        method: 'POST'
    });
}

// Reject event with feedback
async function rejectEvent(eventId, reason) {
    return apiCall(`/admin/events/${eventId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason })
    });
}
