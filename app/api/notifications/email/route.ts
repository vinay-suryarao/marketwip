import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type EmailRequestBody = {
  recipients?: string[];
  title?: string;
  stockTag?: string;
  postSlug?: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = String(process.env.SMTP_SECURE ?? "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return { host, port, secure, user, pass, from, siteUrl };
}

export async function POST(request: Request) {
  const smtp = getSmtpConfig();

  if (!smtp.host || !smtp.user || !smtp.pass || !smtp.from) {
    return NextResponse.json(
      {
        message: "Email provider is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, EMAIL_FROM.",
      },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as EmailRequestBody;
    const recipients = Array.isArray(body.recipients)
      ? [...new Set(body.recipients.map((email) => email.trim().toLowerCase()).filter(Boolean))]
      : [];

    if (recipients.length === 0 || !body.title || !body.stockTag) {
      return NextResponse.json({ message: "Invalid email payload." }, { status: 400 });
    }

    const detailsUrl = body.postSlug && smtp.siteUrl ? `${smtp.siteUrl}/news/${body.postSlug}` : smtp.siteUrl;

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    const text = detailsUrl
      ? `Update related to your wishlist (${body.stockTag}) is posted: ${body.title}. Read: ${detailsUrl}`
      : `Update related to your wishlist (${body.stockTag}) is posted: ${body.title}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.5; color:#1f2d56;">
        <h2 style="margin:0 0 8px;">New Wishlist Update</h2>
        <p style="margin:0 0 8px;">A new post matching your wishlist tag <strong>${body.stockTag}</strong> is now live.</p>
        <p style="margin:0 0 12px;"><strong>${body.title}</strong></p>
        ${detailsUrl ? `<a href="${detailsUrl}" style="display:inline-block;padding:10px 14px;background:#25345F;color:#fff;text-decoration:none;border-radius:6px;">Read Update</a>` : ""}
      </div>
    `;

    const result = await transporter.sendMail({
      from: smtp.from,
      to: smtp.from,
      bcc: recipients,
      subject: `Wishlist update: ${body.stockTag}`,
      text,
      html,
    });

    return NextResponse.json({
      sentCount: recipients.length,
      messageId: result.messageId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Email dispatch failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
