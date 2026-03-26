// backend/controllers/admin.controller.js

// Get dashboard statistics
exports.getDashboardStats = (req, res) => {
    try {
        // Mock data - replace with actual database queries later
        const stats = {
            totalEvents: 24,
            activeEvents: 12,
            totalUsers: 156,
            totalRegistrations: 342,
            pendingVerifications: 5,
            revenue: 12500,
            recentActivity: [
                { type: 'event', action: 'created', name: 'Hackathon 2024', time: '2 hours ago' },
                { type: 'user', action: 'registered', name: 'John Doe', time: '3 hours ago' },
                { type: 'payment', action: 'received', name: '₹500', time: '5 hours ago' }
            ]
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats'
        });
    }
};

// Get all events
exports.getAllEvents = (req, res) => {
    try {
        const events = [
            {
                id: '1',
                title: 'National Hackathon 2024',
                organizer: 'Tech Community',
                date: '2024-04-15',
                registrations: 45,
                status: 'active',
                revenue: 0
            },
            {
                id: '2',
                title: 'Startup Pitching Lab',
                organizer: 'Startup Hub',
                date: '2024-05-20',
                registrations: 23,
                status: 'active',
                revenue: 5000
            }
        ];

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

// Get all users
exports.getAllUsers = (req, res) => {
    try {
        const users = [
            {
                id: '1',
                name: 'Admin User',
                email: 'admin@campusconnect.com',
                role: 'admin',
                status: 'active',
                joined: '2024-01-01'
            },
            {
                id: '2',
                name: 'John Student',
                email: 'john@college.edu',
                role: 'student',
                status: 'active',
                joined: '2024-02-15'
            },
            {
                id: '3',
                name: 'Tech Organizer',
                email: 'organizer@tech.com',
                role: 'organizer',
                status: 'pending',
                joined: '2024-03-10'
            }
        ];

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};

// Get pending verifications
exports.getPendingVerifications = (req, res) => {
    try {
        const pending = [
            {
                id: '3',
                name: 'Tech Organizer',
                email: 'organizer@tech.com',
                organization: 'Tech Corp',
                documents: ['business_license.pdf'],
                submitted: '2024-03-10'
            }
        ];

        res.json({
            success: true,
            count: pending.length,
            data: pending
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching verifications'
        });
    }
};

// Verify organizer
exports.verifyOrganizer = (req, res) => {
    try {
        const { userId } = req.params;
        
        res.json({
            success: true,
            message: `Organizer ${userId} verified successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying organizer'
        });
    }
};

// Get revenue report
exports.getRevenueReport = (req, res) => {
    try {
        const report = {
            total: 25000,
            monthly: [
                { month: 'Jan', amount: 5000 },
                { month: 'Feb', amount: 8000 },
                { month: 'Mar', amount: 12000 }
            ],
            byEvent: [
                { event: 'Hackathon 2024', amount: 5000 },
                { event: 'Workshop Series', amount: 3000 }
            ]
        };

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching revenue report'
        });
    }
};