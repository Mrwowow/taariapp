import nodemailer, { type Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.ZOHO_SMTP_HOST;
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[mailer] Zoho SMTP not configured — emails will be skipped.");
    return null;
  }

  const port = Number(process.env.ZOHO_SMTP_PORT) || 465;
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return cachedTransporter;
}

function fromAddress(): string {
  const email = process.env.ZOHO_FROM_EMAIL || process.env.ZOHO_SMTP_USER || "";
  const name = process.env.ZOHO_FROM_NAME || "TAARi";
  return email ? `"${name}" <${email}>` : name;
}

interface SendMailArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendMail(args: SendMailArgs): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: fromAddress(),
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo,
    });
    return true;
  } catch (err) {
    console.error("[mailer] send failed:", err);
    return false;
  }
}

// ── Templates ───────────────────────────────────────────────────────────────

const BRAND_COLOR = "#C8956C";
const DARK = "#1A1A1A";
const CREAM = "#FAF7F2";

function shell(title: string, body: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:${CREAM};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${DARK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #E5E0D8;">
        <tr><td style="padding:32px 40px;border-bottom:1px solid #E5E0D8;">
          <div style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:${DARK};letter-spacing:-0.5px;">TAARi</div>
          <div style="font-size:11px;color:#6B6B6B;letter-spacing:0.15em;text-transform:uppercase;margin-top:4px;">The African Experience</div>
        </td></tr>
        <tr><td style="padding:40px;">${body}</td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #E5E0D8;font-size:12px;color:#6B6B6B;">
          You received this email from TAARi. If this wasn't you, please ignore this message.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function newsletterWelcomeTemplate(email: string): { subject: string; html: string; text: string } {
  const subject = "Welcome to TAARi";
  const html = shell(
    subject,
    `<h1 style="font-family:Georgia,serif;font-size:28px;margin:0 0 16px 0;color:${DARK};">Welcome to TAARi.</h1>
     <p style="font-size:16px;line-height:1.6;color:${DARK};margin:0 0 16px 0;">
       Thanks for subscribing with <strong>${email}</strong>. You'll get weekly stories from the Diaspora — bold voices, new cities, the work that matters.
     </p>
     <p style="font-size:16px;line-height:1.6;color:${DARK};margin:0 0 24px 0;">
       In the meantime, explore what's already on the site.
     </p>
     <a href="https://taarimag.com" style="display:inline-block;background:${BRAND_COLOR};color:${DARK};text-decoration:none;padding:12px 24px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Read Stories</a>`
  );
  const text = `Welcome to TAARi.\n\nThanks for subscribing with ${email}. You'll get weekly stories from the Diaspora delivered to your inbox.\n\nVisit https://taarimag.com`;
  return { subject, html, text };
}

export function submissionConfirmationTemplate(name: string): { subject: string; html: string; text: string } {
  const subject = "We received your story";
  const html = shell(
    subject,
    `<h1 style="font-family:Georgia,serif;font-size:28px;margin:0 0 16px 0;color:${DARK};">Thanks, ${escapeHtml(name)}.</h1>
     <p style="font-size:16px;line-height:1.6;color:${DARK};margin:0 0 16px 0;">
       We've received your story submission. Our editors will review it and get back to you shortly.
     </p>
     <p style="font-size:16px;line-height:1.6;color:${DARK};margin:0 0 0 0;">
       While you wait, feel free to explore more stories on <a href="https://taarimag.com" style="color:${BRAND_COLOR};">taarimag.com</a>.
     </p>`
  );
  const text = `Thanks, ${name}.\n\nWe've received your story submission. Our editors will review it and get back to you shortly.\n\n— TAARi`;
  return { subject, html, text };
}

export function submissionRejectionTemplate(args: {
  name: string;
  reason: string;
}): { subject: string; html: string; text: string } {
  const subject = "An update on your TAARi story submission";
  const reasonBlock = args.reason.trim()
    ? `<div style="margin-top:16px;padding:16px;background:${CREAM};border-left:3px solid ${BRAND_COLOR};">
         <div style="font-size:11px;color:#6B6B6B;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;">Editor's note</div>
         <p style="font-size:15px;line-height:1.6;color:${DARK};margin:0;white-space:pre-wrap;">${escapeHtml(args.reason)}</p>
       </div>`
    : "";
  const html = shell(
    subject,
    `<h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 16px 0;color:${DARK};">Hi ${escapeHtml(args.name)},</h1>
     <p style="font-size:16px;line-height:1.6;color:${DARK};margin:0 0 16px 0;">
       Thank you for sharing your story with TAARi. After careful review, our editorial team has decided not to move forward with this submission at this time.
     </p>
     ${reasonBlock}
     <p style="font-size:16px;line-height:1.6;color:${DARK};margin:20px 0 16px 0;">
       We encourage you to refine your piece and submit again in the future — we're always looking for voices from the Diaspora.
     </p>
     <p style="font-size:16px;line-height:1.6;color:${DARK};margin:0;">— The TAARi editorial team</p>`
  );
  const text = `Hi ${args.name},\n\nThank you for sharing your story with TAARi. After careful review, our editorial team has decided not to move forward with this submission at this time.\n\n${args.reason.trim() ? `Editor's note:\n${args.reason}\n\n` : ''}We encourage you to refine your piece and submit again in the future.\n\n— The TAARi editorial team`;
  return { subject, html, text };
}

export function submissionAdminNotificationTemplate(args: {
  name: string;
  email: string;
  city: string;
  summary: string;
}): { subject: string; html: string; text: string } {
  const subject = `New story submission from ${args.name}`;
  const html = shell(
    subject,
    `<h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 16px 0;color:${DARK};">New submission received</h1>
     <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;color:${DARK};">
       <tr><td style="padding:6px 0;color:#6B6B6B;width:80px;">Name</td><td style="padding:6px 0;">${escapeHtml(args.name)}</td></tr>
       <tr><td style="padding:6px 0;color:#6B6B6B;">Email</td><td style="padding:6px 0;">${escapeHtml(args.email)}</td></tr>
       <tr><td style="padding:6px 0;color:#6B6B6B;">City</td><td style="padding:6px 0;">${escapeHtml(args.city)}</td></tr>
     </table>
     <div style="margin-top:16px;padding-top:16px;border-top:1px solid #E5E0D8;">
       <div style="font-size:12px;color:#6B6B6B;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Summary</div>
       <p style="font-size:14px;line-height:1.6;color:${DARK};margin:0;white-space:pre-wrap;">${escapeHtml(args.summary)}</p>
     </div>`
  );
  const text = `New story submission\n\nName: ${args.name}\nEmail: ${args.email}\nCity: ${args.city}\n\nSummary:\n${args.summary}`;
  return { subject, html, text };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
