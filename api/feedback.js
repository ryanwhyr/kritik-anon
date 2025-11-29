// api/feedback.js

export default async function handler(req, res) {
  // Hanya izinkan POST
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const { feedback } = req.body ?? {};

    // Validasi isi pesan
    if (typeof feedback !== 'string' || !feedback.trim()) {
      return res
        .status(400)
        .json({ ok: false, message: 'Feedback kosong' });
    }

    // Ambil env dari Vercel
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      // Tidak usah log token, cukup info kalau env kosong
      console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
      return res
        .status(500)
        .json({ ok: false, message: 'Server belum dikonfigurasi' });
    }

    const text = `📩 Masukan anonim baru:\n\n${feedback.trim()}`;

    // Kirim ke Telegram
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }).toString(),
      }
    );

    const data = await tgRes.json();

    if (!tgRes.ok || !data.ok) {
      console.error('Telegram error:', data);
      return res
        .status(500)
        .json({ ok: false, message: 'Gagal kirim ke Telegram' });
    }

    // Berhasil
    return res.status(200).json({ ok: true, message: 'Terkirim' });
  } catch (err) {
    console.error('Handler error:', err);
    return res
      .status(500)
      .json({ ok: false, message: 'Terjadi kesalahan server' });
  }
}
