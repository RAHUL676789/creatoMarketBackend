const transporter = require("./EmailConfig.js");



module.exports.sendVerificationCode = async (email, verificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: '"CreatoMarket 👻" <rahullodhi3814@gmail.com>',
            to: email,
            subject: "Verify your email",
            text: "Verify your email address",
            html: `<div>Hello ${email}, this is your verification code: <b>${verificationCode}</b>. Please verify your email address.</div>`
        });

        // Success response
        return { success: true, message: 'Email sent successfully', response };
    } catch (error) {
        console.log('Email sending error:', error);

        // Error response
        return { success: false, message: 'Failed to send email', error };
    }
}

