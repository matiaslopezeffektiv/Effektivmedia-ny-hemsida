const TO_EMAIL = "hej@effektivmedia.nu";
const FROM_EMAIL = "Effektiv Media <formular@effektivmedia.nu>";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ ok: false, error: "E-postutskick är inte konfigurerat." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ ok: false, error: "Ogiltig data." });
    }
  }
  body = body || {};

  // Honeypot: real visitors never fill this hidden field.
  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const subject = (body.subject || "").trim();
  const callDate = (body.callDate || "").trim();
  const callTime = (body.callTime || "").trim();
  const message = (body.message || "").trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !email || !emailPattern.test(email) || !message) {
    return res.status(400).json({ ok: false, error: "Fyll i namn, en giltig e-postadress och ett meddelande." });
  }

  const rows = [
    ["Namn", name],
    ["E-post", email],
    ["Telefon", phone],
    ["Ämne", subject],
    ["Önskat datum", callDate],
    ["Önskad tid", callTime],
  ].filter(([, value]) => value);

  const html = `
    <h2>Nytt meddelande från kontaktformuläret</h2>
    <table cellpadding="6" cellspacing="0">
      ${rows.map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`).join("")}
    </table>
    <p><strong>Meddelande</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: subject ? `Kontaktformulär: ${subject}` : `Nytt meddelande från ${name}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend error:", resendRes.status, errText);
      return res.status(502).json({ ok: false, error: "Kunde inte skicka meddelandet just nu." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return res.status(500).json({ ok: false, error: "Något gick fel. Försök igen om en stund." });
  }
};
