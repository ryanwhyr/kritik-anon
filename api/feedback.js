// api/feedback.js
// TOKEN & CHAT ID langsung di file (versi paling simpel)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const { feedback } = req.body ?? {};

    if (!feedback || typeof feedback !== 'string' || !feedback.trim()) {
      return res.status(400).json({ ok: false, message: 'Feedback kosong' });
    }

    // ❗ MASUKKAN TOKEN DAN CHAT ID DI SINI
    const TELEGRAM_BOT_TOKEN = "8575937845:AAFGdC8BJ5HhpMy3Rqv4S1pgNx-PQwE3LUI";
    const TELEGRAM_CHAT_ID = "1764442475";

    const text = `📩 Masukan anonim:\n\n${feedback.trim()}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const body = new URLSearchParams({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML"
    });

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });

    const data = await r.json();

    if (!data.ok) {
      console.error("Telegram error:", data);
      return res.status(500).json({ ok: false, message: 'Gagal kirim Telegram' });
    }

    return res.status(200).json({ ok: true, message: 'Terkirim' });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ ok: false, message: 'Terjadi kesalahan server' });
  }
}
