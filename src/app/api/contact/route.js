import { NextResponse } from "next/server";

const MAX_FIELD_LENGTH = 2000;

function sanitize(value) {
  return value
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const name = sanitize(body.name?.toString() || "");
  const phone = sanitize(body.phone?.toString() || "");
  const address = sanitize(body.address?.toString() || "");
  const services = sanitize(body.services?.toString() || "");
  const message = sanitize(body.message?.toString() || "");

  const fieldErrors = {};
  if (!name) fieldErrors.name = "Name is required.";
  if (!phone) fieldErrors.phone = "Phone is required.";
  if (!address) fieldErrors.address = "Address is required.";
  if (!services) fieldErrors.services = "Select at least one service.";
  if (!message) fieldErrors.message = "Project details are required.";

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Please fill in the required fields.", fieldErrors },
      { status: 400 }
    );
  }

  // TODO: replace with sendContactEmail({ name, phone, address, services, message })
  // from "@/lib/mailer" once real SMTP credentials are configured in .env.local.
  console.log("New contact form submission:", {
    name,
    phone,
    address,
    services,
    message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
