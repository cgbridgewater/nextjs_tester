// pages/api/sendEmail.js

// Import the Mailjet client we set up earlier
import mailjetClient from '../../lib/mailjet';

// This API route will handle sending emails
export default async function handler(req, res) {
    // Check if the request method is POST
    if (req.method === 'POST') {
        const { to, subject, text } = req.body;

        try {
            // Send the email using Mailjet
            const request = mailjetClient
                .post('send', { version: 'v3.1' })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: process.env.EMAIL,
                                Name: 'Develop.This()',
                            },
                            To: [
                                {
                                    Email: to,
                                },
                            ],
                            Subject: subject,
                            TextPart: text,
                        },
                    ],
                });

            const result = await request;
            // Respond with success
            res.status(200).json({ success: true, data: result.body });
        } catch (error) {
            // Respond with error
            res.status(500).json({ success: false, message: error.message });
        }
    } else {
        // Handle any other http method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
