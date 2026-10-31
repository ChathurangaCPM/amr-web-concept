import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/contactSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path && typeof path === "string" && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, company, email, fleet, message } = result.data;

    const gmailUser =
      process.env.GMAIL_USER ||
      process.env.SMTP_USER ||
      process.env.EMAIL_USER;
    const gmailPass =
      process.env.GMAIL_APP_PASSWORD ||
      process.env.SMTP_PASS ||
      process.env.EMAIL_PASS ||
      process.env.GMAIL_PASS;
    const recipient =
      process.env.CONTACT_RECIPIENT_EMAIL ||
      process.env.GMAIL_RECIPIENT ||
      gmailUser;

    const ticketId =
      "NX-" + Math.random().toString(36).substring(2, 7).toUpperCase();

    // If SMTP credentials aren't configured yet in environment, respond in preview/demo mode
    if (!gmailUser || !gmailPass) {
      console.warn(
        "[Contact API] GMAIL_USER or GMAIL_APP_PASSWORD not configured. Demo request validated via Zod and handled in preview mode:",
        { ticketId, name, company, email, fleet }
      );

      return NextResponse.json(
        {
          success: true,
          ticketId,
          company,
          name,
          previewMode: true,
          message:
            "Zod validation passed. Demo request logged in preview mode (set GMAIL_USER & GMAIL_APP_PASSWORD for live Gmail delivery).",
        },
        { status: 200 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const mailOptions = {
      from: `"Infinitude Robotics Deploy" <${gmailUser}>`,
      to: recipient,
      replyTo: email,
      subject: `[NEXUS M2 DEMO] New Request: ${company} (Ticket ${ticketId})`,
      text: `
NEW ON-SITE DEMO REQUEST:
---------------------------------------------
Ticket ID:  ${ticketId}
Full Name:  ${name}
Company:    ${company}
Email:      ${email}
Fleet Size: ${fleet}
Message:    ${message || "N/A"}
Timestamp:  ${new Date().toISOString()}
---------------------------------------------
Infinitude Robotics · Autonomous Mobile Systems
      `.trim(),
      html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0a0b0e; color: #f1eee8; padding: 32px 24px; border-radius: 8px; border: 1px solid #262930; max-width: 600px; margin: 0 auto;">
  <div style="border-bottom: 1px solid #ff8a1f; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="color: #ff8a1f; font-size: 20px; margin: 0; letter-spacing: 0.1em; text-transform: uppercase;">
      // INFINITUDE ROBOTICS · DEMO DISPATCH
    </h1>
    <p style="color: #8b8986; font-size: 12px; margin: 6px 0 0; font-family: monospace;">
      TICKET: <strong style="color: #6ee7a8;">${ticketId}</strong> · PRIORITY: HIGH
    </p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 8px 0; color: #8b8986; font-size: 13px; width: 120px; font-family: monospace;">&gt; NAME:</td>
      <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #8b8986; font-size: 13px; font-family: monospace;">&gt; COMPANY:</td>
      <td style="padding: 8px 0; color: #ff8a1f; font-size: 14px; font-weight: 600;">${company}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #8b8986; font-size: 13px; font-family: monospace;">&gt; EMAIL:</td>
      <td style="padding: 8px 0; color: #6ee7a8; font-size: 14px;"><a href="mailto:${email}" style="color: #6ee7a8; text-decoration: none;">${email}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #8b8986; font-size: 13px; font-family: monospace;">&gt; FLEET SIZE:</td>
      <td style="padding: 8px 0; color: #ffffff; font-size: 14px;">${fleet}</td>
    </tr>
    ${
      message
        ? `<tr>
      <td style="padding: 8px 0; color: #8b8986; font-size: 13px; font-family: monospace; vertical-align: top;">&gt; MESSAGE:</td>
      <td style="padding: 8px 0; color: #d0c8b8; font-size: 13px; line-height: 1.5;">${message}</td>
    </tr>`
        : ""
    }
  </table>

  <div style="border-top: 1px solid #262930; padding-top: 16px; font-size: 11px; color: #8b8986; font-family: monospace;">
    <span>SYSTEM: NEXUS M2 FLEET CORE · AUTH: 48V DISPATCH PROTOCOL</span>
  </div>
</div>
      `.trim(),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        ticketId,
        company,
        name,
        previewMode: false,
        message: "Email dispatched successfully via Gmail SMTP.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Contact API Error]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
