import nodemailer from "nodemailer";

const FROM = "Salongen <support@sistasalongen.com>";
const ENABLED = process.env.MAIL_ENABLED === "true";

const transport = nodemailer.createTransport({
  host: "localhost",
  port: 25,
  secure: false,
  tls: { rejectUnauthorized: false },
});

async function send(options: nodemailer.SendMailOptions) {
  if (!ENABLED) {
    console.log("[mailer] MAIL_ENABLED=false — would have sent:", {
      to: options.to,
      subject: options.subject,
    });
    return;
  }
  await transport.sendMail(options);
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const BASE_CSS = `
  body,table,td{margin:0;padding:0;font-family:'Courier New',Courier,monospace}
  body{background:#080808;color:#e5dccf}
  a{color:#ff5a5a}
  .wrap{background:#080808;padding:40px 20px}
  .card{max-width:560px;margin:0 auto;border:1px solid rgba(255,77,77,0.18);background:#0d0d0d}
  .header{padding:28px 36px 22px;border-bottom:1px solid rgba(255,255,255,0.07)}
  .eyebrow{font-size:10px;text-transform:uppercase;letter-spacing:0.35em;color:#ff5a5a;margin:0 0 6px}
  .title{font-size:22px;font-weight:900;text-transform:uppercase;color:#e5dccf;letter-spacing:-0.02em;margin:0}
  .body{padding:28px 36px}
  .label{font-size:9px;text-transform:uppercase;letter-spacing:0.3em;color:rgba(229,220,207,0.4);margin:0 0 4px}
  .value{font-size:14px;color:#e5dccf;margin:0 0 18px}
  .ref-box{border:1px solid rgba(255,77,77,0.2);background:rgba(255,43,43,0.05);padding:16px 20px;margin:20px 0}
  .ref-label{font-size:9px;text-transform:uppercase;letter-spacing:0.3em;color:rgba(229,220,207,0.4);margin:0 0 6px}
  .ref-value{font-size:18px;letter-spacing:0.15em;color:#ffb3b3;margin:0}
  .divider{height:1px;background:rgba(255,255,255,0.07);margin:20px 0}
  .total-row{display:flex;justify-content:space-between}
  .footer{padding:18px 36px;border-top:1px solid rgba(255,255,255,0.07)}
  .footer-text{font-size:9px;text-transform:uppercase;letter-spacing:0.3em;color:rgba(229,220,207,0.25);margin:0}
`;

function wrap(inner: string): string {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>${BASE_CSS}</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    ${inner}
  </div>
</div>
</body>
</html>`;
}

// ── sendBookingConfirmation ───────────────────────────────────────────────────

export interface BookingConfirmationData {
  name: string;
  email: string;
  eventTitle: string;
  eventDate: string;
  seats: string; // e.g. "A1, A2"
  bookingRef: string;
  total: number; // kr
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  const html = wrap(`
    <div class="header">
      <p class="eyebrow">Den Sista Salongen</p>
      <h1 class="title">Bokningsbekräftelse</h1>
    </div>
    <div class="body">
      <p class="label">Hej</p>
      <p class="value">${data.name}</p>

      <p class="label">Event</p>
      <p class="value">${data.eventTitle}</p>

      <p class="label">Datum</p>
      <p class="value">${data.eventDate}</p>

      <p class="label">Platser</p>
      <p class="value">${data.seats}</p>

      <p class="label">Totalt</p>
      <p class="value">${data.total} kr</p>

      <div class="ref-box">
        <p class="ref-label">Bokningsreferens</p>
        <p class="ref-value">${data.bookingRef}</p>
      </div>

      <div class="divider"></div>

      <p style="font-size:12px;color:rgba(229,220,207,0.5);margin:0">
        Din plats är reserverad. Betalning sker via Stripe&nbsp;— kolla din inkorg för betalningslänk.
        Vid frågor, svara på detta mail.
      </p>
    </div>
    <div class="footer">
      <p class="footer-text">support@sistasalongen.com &nbsp;·&nbsp; Göteborg, Sverige</p>
    </div>
  `);

  await send({
    from: FROM,
    to: data.email,
    subject: `Bokningsbekräftelse — ${data.eventTitle} [${data.bookingRef}]`,
    html,
  });
}

// ── sendShopReceipt ───────────────────────────────────────────────────────────

export interface ShopReceiptData {
  name: string;
  email: string;
  items: Array<{ name: string; quantity: number }>;
  total: number; // öre
  orderId: string;
}

export async function sendShopReceipt(data: ShopReceiptData) {
  const totalKr = (data.total / 100).toFixed(0);

  const itemRows = data.items
    .map(
      (i) => `
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#e5dccf;border-bottom:1px solid rgba(255,255,255,0.05)">
          ${i.name}
        </td>
        <td style="padding:6px 0;font-size:13px;color:rgba(229,220,207,0.5);text-align:right;border-bottom:1px solid rgba(255,255,255,0.05)">
          ×${i.quantity}
        </td>
      </tr>`
    )
    .join("");

  const html = wrap(`
    <div class="header">
      <p class="eyebrow">Den Sista Salongen</p>
      <h1 class="title">Orderbekräftelse</h1>
    </div>
    <div class="body">
      <p class="label">Tack för din beställning</p>
      <p class="value">${data.name}</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
        ${itemRows}
      </table>

      <div class="divider"></div>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:11px;text-transform:uppercase;letter-spacing:0.25em;color:rgba(229,220,207,0.4)">Totalt</td>
          <td style="font-size:16px;font-weight:900;color:#ffb3b3;text-align:right">${totalKr} kr</td>
        </tr>
      </table>

      <div class="ref-box">
        <p class="ref-label">Order-ID</p>
        <p class="ref-value" style="font-size:13px">${data.orderId}</p>
      </div>

      <div class="divider"></div>

      <p style="font-size:12px;color:rgba(229,220,207,0.5);margin:0">
        Din order är mottagen och hanteras av Printful. Leveransinfo skickas separat.
        Vid frågor — svara på detta mail.
      </p>
    </div>
    <div class="footer">
      <p class="footer-text">support@sistasalongen.com &nbsp;·&nbsp; Göteborg, Sverige</p>
    </div>
  `);

  await send({
    from: FROM,
    to: data.email,
    subject: `Orderbekräftelse — Salongen [${data.orderId}]`,
    html,
  });
}
