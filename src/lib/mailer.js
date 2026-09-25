import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site-config";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function buildContactEmailHtml({ name, phone, address, services, message }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: #14161a; padding: 24px; text-align: center;">
        <h1 style="color: #f4f5f7; font-size: 18px; margin: 0; letter-spacing: 0.05em; text-transform: uppercase;">
          ${siteConfig.name}
        </h1>
      </div>
      <div style="padding: 24px; border: 1px solid #d7dbe1; border-top: none;">
        <h2 style="font-size: 16px; margin-top: 0;">New quote request</h2>
        <p style="margin: 4px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 4px 0;"><strong>Phone:</strong> ${phone}</p>
        ${address ? `<p style="margin: 4px 0;"><strong>Address:</strong> ${address}</p>` : ""}
        ${services ? `<p style="margin: 4px 0;"><strong>Services:</strong> ${services}</p>` : ""}
        <p style="margin: 16px 0 4px;"><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
      </div>
    </div>
  `;
}

export async function sendContactEmail({ name, phone, address, services, message }) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${siteConfig.name} Website" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO_EMAIL,
    subject: `New quote request from ${name}`,
    html: buildContactEmailHtml({ name, phone, address, services, message }),
  });
}
