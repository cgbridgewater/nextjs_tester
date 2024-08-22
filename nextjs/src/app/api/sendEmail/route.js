import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'

export async function POST(request) {
    try {
        const { subject, message, contact, userName } = await request.json();
        // // EMAIL CONFIG HERE
            const transporter = nodemailer.createTransport({
            host: 'smtp.outlook.office365.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // your email
                pass: process.env.EMAIL_PASS, // your password
            },
        })

        // // MAIL PACKAGE BUNDLE
        const mailOption = {
            // SENDS EMAIL - MUST MATCH AUTH EMAIL
            from: process.env.EMAIL_USER,
            // SENDS EMAIL TO OUR ACCOUNT
            to: process.env.EMAIL_USER,
            // OPTIONAL SEND COPY TO CLIENT
            bcc: contact,
            // EMAIL CONTENT
            subject: `Message Confirmation for ${userName} | ${subject}`,
            html: 
            `
                <p>***This is confirming your message was received and we will be in contact with you shortly***</p>
                <p>Message from <b>${userName}</b></p>
                <div style="margin-top: 16px;">
                    <h5 style="margin: 0;">Contact Email:</h5>
                    <p style="margin: 0;">${contact}</p> 
                </div>
                <div style="margin-top: 16px;">
                    <h5 style="margin: 0;">Subject:</h5>
                    <p style="margin: 0;">${subject}</p>
                </div>
                <div style="margin-top: 16px;">
                    <h5 style="margin: 0;">Message:</h5>
                    <p style="margin: 0;">${message}</p>
                </div>
                <hr>
                <h6>Disclaimer:</h6>
                <p>This email was intended for ${userName}/${contact}. If you are not the intended recipient of this email, please notify the sender immediately by replying to this message and delete this email from your inbox. Any unauthorized use, disclosure, or distribution of this email is prohibited. Thank you for your understanding.</p>
            `
        }

        // SEND IT! 
        await transporter.sendMail(mailOption);
        console.log("200 - Email Sent Successfully");
        return NextResponse.json({ message: "Email Sent Successfully" }, { status: 200 });
    } catch (error) {
        console.log("500 - Failed to Send Email");
        return NextResponse.json({ message: "Failed to Send Email" }, { status: 500 });
    }
};