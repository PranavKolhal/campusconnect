

let currentUser = null;

// Store for registered users (in production, this would be a database)
let registeredUsers = [];

// Load registered users from localStorage
function loadRegisteredUsers() {
    const users = localStorage.getItem('registered_users');
    if (users) {
        try {
            registeredUsers = JSON.parse(users);
        } catch (e) {
            console.error('Error loading users');
            registeredUsers = [];
        }
    } else {
        // Add default admin account
        registeredUsers = [
            {
                id: 'admin1',
                name: 'Admin User',
                email: 'admin@campusconnect.com',
                password: 'Admin@123',
                role: 'admin',
                college: 'CampusConnect',
                registeredAt: new Date().toISOString()
            }
        ];
        saveRegisteredUsers();
    }
    console.log('Loaded users:', registeredUsers.length);
}

// Save registered users to localStorage
function saveRegisteredUsers() {
    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
}

// Initialize
loadRegisteredUsers();

function checkAuth() {
    const userData = localStorage.getItem('current_user');
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            updateUIForLoggedInUser();
            return true;
        } catch (e) {
            console.log('Error parsing user data');
            return false;
        }
    }
    return false;
}

// REPLACE your existing updateUIForLoggedInUser with this:
function updateUIForLoggedInUser() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');

    if (currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userAvatar) userAvatar.textContent = currentUser.name?.charAt(0) || 'U';
        if (userName) userName.textContent = currentUser.name?.split(' ')[0] || 'User';
    } else {
        if (authButtons) authButtons.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
    
    // Update role-based navigation
    updateRoleBasedNavigation();
}

// Also add this NEW function right after it:
function updateRoleBasedNavigation() {
    const navOrganizerLink = document.getElementById('navOrganizerLink');
    const navAdminLink = document.getElementById('navAdminLink');
    const organizerLink = document.getElementById('organizerLink');
    const adminLink = document.getElementById('adminLink');
    
    if (currentUser) {
        // Show/hide based on role
        if (currentUser.role === 'organizer' || currentUser.role === 'admin') {
            if (navOrganizerLink) navOrganizerLink.style.display = 'inline-block';
            if (organizerLink) organizerLink.style.display = 'block';
        } else {
            if (navOrganizerLink) navOrganizerLink.style.display = 'none';
            if (organizerLink) organizerLink.style.display = 'none';
        }
        
        if (currentUser.role === 'admin') {
            if (navAdminLink) navAdminLink.style.display = 'inline-block';
            if (adminLink) adminLink.style.display = 'block';
        } else {
            if (navAdminLink) navAdminLink.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
        }
    } else {
        // No user logged in
        if (navOrganizerLink) navOrganizerLink.style.display = 'none';
        if (navAdminLink) navAdminLink.style.display = 'none';
        if (organizerLink) organizerLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('current_user');
    currentUser = null;
    window.location.href = 'index.html';
}

// REAL REGISTER FUNCTION
function register(userData) {
    console.log('Registering:', userData);
    
    // Validate phone for organizers
    if (userData.role === 'organizer' && !userData.phone) {
        alert('Phone number is required for organizers');
        return false;
    }
    
    // Check if email already exists
    let users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
        alert('Email already registered. Please login.');
        return false;
    }
    
    // Create new user with phone
    const newUser = {
        id: 'user_' + Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'student',
        college: userData.college || '',
        phone: userData.phone || '',  // Save phone number
        registeredAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(users));
    
    alert('Registration successful! Please login.');
    return true;
}

// REAL SECURE LOGIN FUNCTION - No more fake logins!
function login(email, password) {
    console.log('Login attempt for:', email);
    
    // Check for admin login
    if (email === 'admin@campusconnect.com' && password === 'Admin@123') {
        const adminUser = {
            id: 'admin1',
            name: 'Admin User',
            email: email,
            role: 'admin'
        };
        localStorage.setItem('current_user', JSON.stringify(adminUser));
        currentUser = adminUser;
        updateUIForLoggedInUser();
        window.location.href = 'admin-pending.html';
        return true;
    }
    
    // Check registered users ONLY - NO FALLBACK!
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login successful - real registered user
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('current_user', JSON.stringify(userWithoutPassword));
        currentUser = userWithoutPassword;
        updateUIForLoggedInUser();
        
        if (user.role === 'organizer') {
            window.location.href = 'organizer.html';
        } else {
            window.location.href = 'index.html';
        }
        return true;
    }
    
    // Login failed - no fake logins allowed!
    alert('Invalid email or password. Please register first.');
    return false;
}




// OTP Functions
function switchAuthTab(tab) {
    document.getElementById('passwordTab').classList.toggle('active', tab === 'password');
    document.getElementById('otpTab').classList.toggle('active', tab === 'otp');
    document.getElementById('passwordLogin').style.display = tab === 'password' ? 'block' : 'none';
    document.getElementById('otpLogin').style.display = tab === 'otp' ? 'block' : 'none';
}

async function requestOTP() {
    const email = document.getElementById('otpEmail').value;
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email');
        return;
    }
    
    try {
        // Call your backend
        const response = await fetch('/api/otp/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('otpRequestSection').style.display = 'none';
            document.getElementById('otpVerifySection').style.display = 'block';
            document.getElementById('otpEmailDisplay').textContent = email;
            document.getElementById('otpEmail').value = email;
            
            // For development only - show OTP in console
            console.log('OTP sent to:', email);
        } else {
            alert(data.message || 'Failed to send OTP');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending OTP. Please try again.');
    }
}

async function verifyOTP() {
    const email = document.getElementById('otpEmail').value;
    const otp = document.getElementById('otpCode').value;
    
    if (!otp || otp.length !== 6) {
        alert('Please enter 6-digit code');
        return;
    }
    
    try {
        const response = await fetch('/api/otp/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Login successful!');
            hideModal('loginModal');
            // Fetch user data or redirect
            window.location.reload();
        } else {
            alert(data.message || 'Invalid OTP');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error verifying OTP');
    }
}

function resendOTP() {
    document.getElementById('otpVerifySection').style.display = 'none';
    document.getElementById('otpRequestSection').style.display = 'block';
    document.getElementById('otpCode').value = '';
}



// Store registration data temporarily
let pendingRegistration = null;

// Step 1: Send verification OTP
async function sendVerificationOTP() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    const college = document.getElementById('regCollege').value;
    
    // Validate
    if (!name || !email || !password) {
        alert('Please fill all required fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    // Store data temporarily
    pendingRegistration = { name, email, password, role, college };
    
    try {
        const response = await fetch('http://localhost:5000/api/otp/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show OTP step
            document.getElementById('registerStep1').style.display = 'none';
            document.getElementById('registerStep2').style.display = 'block';
            document.getElementById('verifiedEmail').textContent = email;
            
            // For development - log OTP
            console.log('OTP sent to:', email);
        } else {
            alert(data.message || 'Failed to send verification code');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending verification code');
    }
}

// Step 2: Verify OTP and complete registration
async function verifyAndRegister() {
    const otp = document.getElementById('otpCode').value;
    
    if (!otp || otp.length !== 6) {
        alert('Please enter 6-digit code');
        return;
    }
    
    if (!pendingRegistration) {
        alert('Registration data missing. Please start over.');
        return;
    }
    
    try {
        // Verify OTP
        const verifyResponse = await fetch('http://localhost:5000/api/otp/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: pendingRegistration.email, 
                otp: otp 
            })
        });
        
        const verifyData = await verifyResponse.json();
        
        if (verifyData.success) {
            // OTP verified - now create account
            const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pendingRegistration)
            });
            
            const registerData = await registerResponse.json();
            
            if (registerData.success) {
                alert('✅ Registration successful! Please login.');
                hideModal('registerModal');
                showModal('loginModal');
                
                // Clear form
                document.getElementById('regName').value = '';
                document.getElementById('regEmail').value = '';
                document.getElementById('regPassword').value = '';
                document.getElementById('regCollege').value = '';
                document.getElementById('otpCode').value = '';
                
                // Reset to step 1
                document.getElementById('registerStep1').style.display = 'block';
                document.getElementById('registerStep2').style.display = 'none';
                pendingRegistration = null;
            } else {
                alert(registerData.message || 'Registration failed');
            }
        } else {
            alert(verifyData.message || 'Invalid verification code');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error verifying code');
    }
}

// Resend OTP
async function resendVerificationOTP() {
    if (!pendingRegistration) return;
    
    try {
        const response = await fetch('http://localhost:5000/api/otp/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: pendingRegistration.email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('New verification code sent!');
        } else {
            alert(data.message || 'Failed to resend code');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error resending code');
    }
}

// Update your existing handleRegister function to use the new flow
function handleRegister() {
    // This now just starts the OTP flow
    sendVerificationOTP();
}




// Get current user
function getCurrentUser() {
    if (!currentUser) {
        const userData = localStorage.getItem('current_user');
        if (userData) {
            try {
                currentUser = JSON.parse(userData);
            } catch (e) {
                console.error('Error parsing user data');
            }
        }
    }
    return currentUser;
}

// Make functions global
window.logout = logout;
window.login = login;
window.register = register;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;

 


// Add this function to auth.js if it's not there
function updateUserProfile(updatedData) {
    console.log('Updating user profile:', updatedData);
    
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('You must be logged in to update profile');
        return false;
    }
    
    // Get registered users
    let registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    // Find and update user in registered users
    const userIndex = registeredUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        // Update the user in registeredUsers
        registeredUsers[userIndex] = {
            ...registeredUsers[userIndex],
            name: updatedData.name || registeredUsers[userIndex].name,
            college: updatedData.college || registeredUsers[userIndex].college
        };
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
        
        // Update current user
        const updatedUser = {
            ...currentUser,
            name: updatedData.name || currentUser.name,
            college: updatedData.college || currentUser.college
        };
        
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        
        // Update the global currentUser variable
        window.currentUser = updatedUser;
        
        console.log('Profile updated successfully');
        return true;
    }
    
    return false;
}

// Make sure it's global
window.updateUserProfile = updateUserProfile;
// Make functions global
window.logout = logout;
window.login = login;
window.register = register;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.sendVerificationOTP = sendVerificationOTP;
window.verifyAndRegister = verifyAndRegister;
window.resendVerificationOTP = resendVerificationOTP;


// Enhanced register with email validation
async function handleRegister() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    const college = document.getElementById('regCollege').value;
    
    // Basic validation
    if (!name || !email || !password) {
        alert('Please fill all required fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    // Show loading
    const registerBtn = event.target;
    const originalText = registerBtn.textContent;
    registerBtn.textContent = 'Validating email...';
    registerBtn.disabled = true;
    
    try {
        // Validate email
        const validation = await validateEmail(email);
        
        if (!validation.valid) {
            alert(validation.message);
            registerBtn.textContent = originalText;
            registerBtn.disabled = false;
            return;
        }
        
        // If email has correction suggestion
        if (validation.corrected) {
            const useCorrected = confirm(`${validation.message}\n\nUse ${validation.corrected} instead?`);
            if (useCorrected) {
                document.getElementById('regEmail').value = validation.corrected;
                registerBtn.textContent = originalText;
                registerBtn.disabled = false;
                return; // Let user confirm the correction
            }
        }
        
        // Check if email already registered
        const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            alert('Email already registered. Please login.');
            registerBtn.textContent = originalText;
            registerBtn.disabled = false;
            return;
        }
        
        // Register user
        const success = register({
            name: name,
            email: email,
            password: password,
            role: role,
            college: college
        });
        
        if (success) {
            alert('Registration successful! Please login.');
            hideModal('registerModal');
            showModal('loginModal');
            
            // Clear form
            document.getElementById('regName').value = '';
            document.getElementById('regEmail').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regCollege').value = '';
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        alert('Error during registration. Please try again.');
    } finally {
        registerBtn.textContent = originalText;
        registerBtn.disabled = false;
    }
}







// Store reset email temporarily
let resetEmailTemp = null;

// Show forgot password modal
function showForgotPasswordModal() {
    // Reset form
    document.getElementById('resetStep1').style.display = 'block';
    document.getElementById('resetStep2').style.display = 'none';
    document.getElementById('resetStep3').style.display = 'none';
    document.getElementById('resetEmail').value = '';
    document.getElementById('resetOTP').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    resetEmailTemp = null;
    
    showModal('forgotPasswordModal');
}

// Step 1: Request OTP for password reset
async function requestPasswordResetOTP() {
    const email = document.getElementById('resetEmail').value;
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email');
        return;
    }
    
    // Check if email exists in registered users
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const userExists = users.find(u => u.email === email);
    
    if (!userExists) {
        alert('No account found with this email');
        return;
    }
    
    resetEmailTemp = email;
    
    try {
        const response = await fetch('http://localhost:5000/api/otp/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show OTP step
            document.getElementById('resetStep1').style.display = 'none';
            document.getElementById('resetStep2').style.display = 'block';
            document.getElementById('resetEmailDisplay').textContent = email;
        } else {
            alert(data.message || 'Failed to send code');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending verification code');
    }
}

// Step 2: Verify OTP
async function verifyResetOTP() {
    const otp = document.getElementById('resetOTP').value;
    
    if (!otp || otp.length !== 6) {
        alert('Please enter 6-digit code');
        return;
    }
    
    if (!resetEmailTemp) {
        alert('Please start over');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/otp/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: resetEmailTemp, 
                otp: otp 
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show new password step
            document.getElementById('resetStep2').style.display = 'none';
            document.getElementById('resetStep3').style.display = 'block';
            document.getElementById('resetEmailFinal').textContent = resetEmailTemp;
        } else {
            alert(data.message || 'Invalid code');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error verifying code');
    }
}

// Step 3: Update password
function updatePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!newPassword || newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (!resetEmailTemp) {
        alert('Please start over');
        return;
    }
    
    // Get registered users
    let users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const userIndex = users.findIndex(u => u.email === resetEmailTemp);
    
    if (userIndex !== -1) {
        // Update password (in production, this should be hashed)
        users[userIndex].password = newPassword;
        localStorage.setItem('registered_users', JSON.stringify(users));
        
        alert('✅ Password updated successfully! Please login.');
        hideModal('forgotPasswordModal');
        showModal('loginModal');
        
        // Clear form
        resetEmailTemp = null;
        document.getElementById('resetOTP').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    } else {
        alert('User not found');
    }
}


// Resend OTP
async function resendResetOTP() {
    if (!resetEmailTemp) return;
    
    try {
        const response = await fetch('http://localhost:5000/api/otp/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetEmailTemp })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('New code sent!');
        } else {
            alert(data.message || 'Failed to resend code');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error resending code');
    }
}

// Make functions global
window.showForgotPasswordModal = showForgotPasswordModal;
window.requestPasswordResetOTP = requestPasswordResetOTP;
window.verifyResetOTP = verifyResetOTP;
window.updatePassword = updatePassword;
window.resendResetOTP = resendResetOTP;






// List of disposable/temporary email domains to block
const disposableDomains = [
    'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'throwawaymail.com',
    'mailinator.com', 'yopmail.com', 'trashmail.com', 'spamgourmet.com',
    'mailnator.com', 'temp-mail.org', 'mailcatch.com', 'fakemail.net',
    'dispostable.com', 'sharklasers.com', 'grr.la', 'guerrillamail.org'
];

// Check if domain is from a disposable email service
function isDisposableEmail(email) {
    const domain = email.split('@')[1].toLowerCase();
    return disposableDomains.includes(domain);
}

// Check if domain has valid MX records (email server exists)
async function hasValidMXRecord(email) {
    const domain = email.split('@')[1];
    
    try {
        // Using Cloudflare DNS over HTTPS API (free, no API key needed)
        const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
            headers: {
                'Accept': 'application/dns-json'
            }
        });
        
        const data = await response.json();
        
        // Check if there are MX records
        if (data.Answer && data.Answer.length > 0) {
            return data.Answer.some(record => record.type === 15); // MX record type is 15
        }
        return false;
    } catch (error) {
        console.error('Error checking MX records:', error);
        return true; // Assume valid if can't check (avoids blocking real emails)
    }
}

// Common typos to suggest corrections
const commonDomains = {
    'gamil.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'hotmai.com': 'hotmail.com',
    'hotmal.com': 'hotmail.com',
    'yaho.com': 'yahoo.com',
    'yhoo.com': 'yahoo.com',
    'outloo.com': 'outlook.com',
    'outlok.com': 'outlook.com'
};

// Suggest correction for common typos
function suggestEmailCorrection(email) {
    const [local, domain] = email.split('@');
    const correctedDomain = commonDomains[domain?.toLowerCase()];
    
    if (correctedDomain) {
        return `${local}@${correctedDomain}`;
    }
    return null;
}

// Main email validation function
async function validateEmail(email) {
    // 1. Basic format check
    if (!email || !email.includes('@') || !email.includes('.')) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    // 2. Check length
    if (email.length > 254) {
        return { valid: false, message: 'Email address is too long' };
    }
    
    const [localPart, domain] = email.split('@');
    
    // 3. Check local part length
    if (localPart.length > 64) {
        return { valid: false, message: 'Email local part is too long' };
    }
    
    // 4. Check for common disposable email domains
    if (isDisposableEmail(email)) {
        return { valid: false, message: 'Please use a permanent email address. Temporary emails are not allowed.' };
    }
    
    // 5. Check for common typos and suggest correction
    const correctedEmail = suggestEmailCorrection(email);
    if (correctedEmail) {
        return { 
            valid: true, 
            corrected: correctedEmail,
            message: `Did you mean ${correctedEmail}?`
        };
    }
    
    // 6. Optional: Check if domain has MX records (valid email server)
    // Comment this out if you want to skip DNS lookup (saves time)
    /*
    const hasMX = await hasValidMXRecord(email);
    if (!hasMX) {
        return { valid: false, message: 'This email domain does not appear to exist' };
    }
    */
    
    return { valid: true };
}