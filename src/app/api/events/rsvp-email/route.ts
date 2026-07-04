import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, eventId, eventDetails } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Setup Nodemailer transport
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || "test@example.com",
                pass: process.env.SMTP_PASS || "password",
            },
        });

        // Use event details or defaults
        const title = eventDetails?.title || `DevPath Event (${eventId})`;
        const description = eventDetails?.description || "Thank you for RSVPing! See you at the event.";
        
        // Very basic .ics template
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DevPath//NONSGML v1.0//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
DTSTART:20261231T120000Z
DTEND:20261231T130000Z
END:VEVENT
END:VCALENDAR`;

        const mailOptions = {
            from: process.env.SMTP_FROM || '"DevPath Events" <events@devpath.com>',
            to: email,
            subject: `RSVP Confirmation: ${title}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Hi ${name || "there"},</h2>
                    <p>Thank you for RSVPing to <strong>${title}</strong>!</p>
                    <p>${description}</p>
                    <p>We've attached a calendar invite (.ics) to this email.</p>
                    <br/>
                    <p>Best regards,<br/>The DevPath Team</p>
                </div>
            `,
            attachments: [
                {
                    filename: "invite.ics",
                    content: icsContent,
                    contentType: "text/calendar",
                }
            ]
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Email sent" });
    } catch (error) {
        console.error("[RSVP Email Error]:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
