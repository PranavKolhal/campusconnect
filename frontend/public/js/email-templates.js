// frontend/public/js/email-templates.js

const emailTemplates = {
    // When event is approved
    eventApproved: (organizerName, eventTitle) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 20px;">
            <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
                    <h1 style="color: #333; margin-bottom: 10px;">Event Approved!</h1>
                    <p style="color: #666; font-size: 18px;">Your event is now live on CampusConnect</p>
                </div>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0;">
                    <h2 style="color: #4f46e5; margin-bottom: 15px;">🎉 Congratulations ${organizerName}!</h2>
                    <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                        Your event <strong>"${eventTitle}"</strong> has been reviewed and approved by our team. 
                        It is now visible to thousands of students on CampusConnect!
                    </p>
                    
                    <div style="background: #e0e7ff; padding: 15px; border-radius: 8px;">
                        <p style="color: #4f46e5; font-weight: 600;">📊 Event Statistics:</p>
                        <ul style="color: #555; margin-top: 10px;">
                            <li>📅 5000+ students will see your event</li>
                            <li>📧 Email notifications sent to interested students</li>
                            <li>🔍 Visible in search and categories</li>
                        </ul>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block;">
                        View Your Event →
                    </a>
                </div>
                
                <div style="border-top: 2px solid #f0f0f0; padding-top: 20px; margin-top: 20px;">
                    <p style="color: #999; font-size: 14px; text-align: center;">
                        Need to make changes? <a href="#" style="color: #4f46e5;">Edit Event</a> | 
                        <a href="#" style="color: #4f46e5;">Dashboard</a>
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #aaa; font-size: 12px;">
                        © 2024 CampusConnect. All rights reserved.<br>
                        Made with ❤️ for students, by students.
                    </p>
                </div>
            </div>
        </div>
    `,

    // When event is rejected
    eventRejected: (organizerName, eventTitle, reason) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f56565 0%, #ed64a6 100%); padding: 40px; border-radius: 20px;">
            <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 60px; margin-bottom: 20px;">📝</div>
                    <h1 style="color: #333; margin-bottom: 10px;">Event Update</h1>
                    <p style="color: #666; font-size: 18px;">We need some changes before approval</p>
                </div>
                
                <div style="background: #fff5f5; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #f56565;">
                    <h2 style="color: #e53e3e; margin-bottom: 15px;">Hello ${organizerName},</h2>
                    <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                        We've reviewed your event <strong>"${eventTitle}"</strong> and need some adjustments 
                        before it can go live on CampusConnect.
                    </p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
                        <p style="color: #e53e3e; font-weight: 600; margin-bottom: 10px;">📋 Feedback from Admin:</p>
                        <p style="color: #555; background: #f8fafc; padding: 15px; border-radius: 5px;">
                            "${reason || 'Please provide more details about your event and verify your organizer credentials.'}"
                        </p>
                    </div>
                    
                    <div style="background: #ebf4ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <p style="color: #4f46e5; font-weight: 600;">📌 Common Issues to Check:</p>
                        <ul style="color: #555; margin-top: 10px; padding-left: 20px;">
                            <li>Complete organizer verification</li>
                            <li>Clear event description</li>
                            <li>Valid contact information</li>
                            <li>Proper event category</li>
                        </ul>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="background: #4f46e5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block;">
                        Edit and Resubmit →
                    </a>
                </div>
                
                <div style="border-top: 2px solid #f0f0f0; padding-top: 20px; margin-top: 20px;">
                    <p style="color: #666; font-size: 15px; text-align: center; line-height: 1.6;">
                        Need help? Reply to this email or contact our support team.<br>
                        We're here to help you get your event live!
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #aaa; font-size: 12px;">
                        © 2024 CampusConnect. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    `,

    // New organizer welcome email
    organizerWelcome: (organizerName) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #38a169 0%, #4299e1 100%); padding: 40px; border-radius: 20px;">
            <div style="background: white; padding: 40px; border-radius: 15px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                    <h1 style="color: #333;">Welcome to CampusConnect!</h1>
                </div>
                
                <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                    Hi <strong>${organizerName}</strong>, thank you for joining CampusConnect as an organizer!
                </p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #4f46e5; margin-bottom: 15px;">🚀 Next Steps:</h3>
                    <ol style="color: #555; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Complete your organizer profile</li>
                        <li style="margin-bottom: 10px;">Submit your first event for approval</li>
                        <li style="margin-bottom: 10px;">Share your event with students</li>
                    </ol>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600;">
                        Create Your First Event →
                    </a>
                </div>
            </div>
        </div>
    `,

    // Notification to students about new event
    newEventNotification: (studentName, eventTitle, eventDate, eventLocation) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 20px;">
            <div style="background: white; padding: 40px; border-radius: 15px;">
                <h2 style="color: #333; margin-bottom: 20px;">Hey ${studentName}! 👋</h2>
                
                <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
                    A new event matching your interests has been posted!
                </p>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 15px; margin: 20px 0;">
                    <span style="background: #4f46e5; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">NEW</span>
                    <h3 style="margin: 15px 0 10px;">${eventTitle}</h3>
                    <p style="color: #666;">📅 ${eventDate} | 📍 ${eventLocation}</p>
                </div>
                
                <a href="#" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 50px; display: inline-block;">
                    View Event →
                </a>
            </div>
        </div>
    `
};