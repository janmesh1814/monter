const nodemailer = require('nodemailer');

// Function to send OTP to the user's email
async function sendOTP(email, otp) {
    try {
        // Create a Nodemailer transporter using SMTP
        let transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587, // Your SMTP port (usually 587 for TLS)
            secure: false, // true for 465, false for other ports
            auth: {
                user: "janmeshrajput1814@gmail.com",
                pass: "yamy nbzr jilh wrce"
            }
        });

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'janmeshrajput1814@gmail.com', // Sender address
            to: email, // List of receivers
            subject: 'OTP Verification', // Subject line
            text: `Your OTP for verification is: ${otp}`, // Plain text body
            // html: '<b>Hello world?</b>' // HTML body (optional)
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}

module.exports = sendOTP;