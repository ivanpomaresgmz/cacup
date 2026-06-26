export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { to, link } = req.body;
  if (!to || !link) return res.status(400).json({ error: 'Faltan parámetros' });

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer re_4sbv73wX_PBgaF2hyyDhRDobGHVGzEAk8`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'CaCup <onboarding@resend.dev>',
      to,
      subject: '💩 Recupera tu contraseña de CaCup',
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f0f0f;color:#f0f0f0;border-radius:16px;">
        <h1 style="font-size:36px;color:#f5c400;margin:0 0 8px;">CaCup 💩</h1>
        <p style="color:#888;margin:0 0 24px;">Alguien solicitó cambiar la contraseña de tu cuenta.</p>
        <a href="${link}" style="display:inline-block;background:#f5c400;color:#000;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:16px;">Cambiar contraseña</a>
        <p style="color:#555;font-size:12px;margin-top:24px;">Este link caduca en 1 hora. Si no lo pediste, ignora este email.</p>
      </div>`,
    }),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
