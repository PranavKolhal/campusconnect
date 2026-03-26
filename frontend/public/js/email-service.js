// frontend/public/js/email-service.js

class EmailService {
    constructor() {
        // In production, use actual email service
        // For demo, we'll use mailto links and console
        this.apiKey = 'your-sendgrid-api-key'; // Add your SendGrid key later
    }

    // Send email using mailto (for demo)
    sendMailto(to, subject, body) {
        const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink);
    }

    // Send HTML email (in production, this would call your backend)
    async sendEmail(to, subject, htmlContent) {
        console.log('📧 Sending email to:', to);
        console.log('📝 Subject:', subject);
        console.log('📄 Content:', htmlContent);
        
        // For demo, open in default email client
        // this.sendMailto(to, subject, htmlContent.replace(/<[^>]*>/g, '')); // Strip HTML for mailto
        
        // Show preview modal for demo
        this.showEmailPreview(to, subject, htmlContent);
        
        // In production, you would:
        /*
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to, subject, html: htmlContent })
        });
        return response.json();
        */
    }

    // Preview email in modal (for demo)
    showEmailPreview(to, subject, htmlContent) {
        // Create modal if it doesn't exist
        if (!document.getElementById('emailPreviewModal')) {
            const modal = document.createElement('div');
            modal.id = 'emailPreviewModal';
            modal.style.cssText = `
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 3000;
                justify-content: center;
                align-items: center;
            `;
            
            modal.innerHTML = `
                <div style="background: white; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; border-radius: 15px; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <h2>📧 Email Preview</h2>
                        <button onclick="document.getElementById('emailPreviewModal').style.display='none'" style="background: none; border: none; font-size: 20px; cursor: pointer;">✕</button>
                    </div>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <p><strong>To:</strong> <span id="previewTo"></span></p>
                        <p><strong>Subject:</strong> <span id="previewSubject"></span></p>
                    </div>
                    <div id="previewContent" style="border: 1px solid #f0f0f0; border-radius: 8px; padding: 20px; max-height: 400px; overflow-y: auto;"></div>
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button onclick="document.getElementById('emailPreviewModal').style.display='none'" class="btn btn-primary" style="flex: 1;">Close</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
        
        const modal = document.getElementById('emailPreviewModal');
        document.getElementById('previewTo').textContent = to;
        document.getElementById('previewSubject').textContent = subject;
        document.getElementById('previewContent').innerHTML = htmlContent;
        
        modal.style.display = 'flex';
    }

    // Send event approval email
    async sendEventApproved(organizerEmail, organizerName, eventTitle) {
        const subject = `✅ Event Approved: ${eventTitle} is now live on CampusConnect!`;
        const htmlContent = emailTemplates.eventApproved(organizerName, eventTitle);
        
        return this.sendEmail(organizerEmail, subject, htmlContent);
    }

    // Send event rejection email
    async sendEventRejected(organizerEmail, organizerName, eventTitle, reason) {
        const subject = `📝 Update regarding your event: ${eventTitle}`;
        const htmlContent = emailTemplates.eventRejected(organizerName, eventTitle, reason);
        
        return this.sendEmail(organizerEmail, subject, htmlContent);
    }

    // Send welcome email to new organizer
    async sendOrganizerWelcome(organizerEmail, organizerName) {
        const subject = `🎉 Welcome to CampusConnect, ${organizerName}!`;
        const htmlContent = emailTemplates.organizerWelcome(organizerName);
        
        return this.sendEmail(organizerEmail, subject, htmlContent);
    }

    // Notify students about new event
    async notifyStudentsAboutEvent(students, eventTitle, eventDate, eventLocation) {
        for (const student of students) {
            const subject = `🎯 New Event: ${eventTitle} matches your interests!`;
            const htmlContent = emailTemplates.newEventNotification(
                student.name,
                eventTitle,
                eventDate,
                eventLocation
            );
            
            await this.sendEmail(student.email, subject, htmlContent);
        }
    }
}

// Create global instance
const emailService = new EmailService();