export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok:false, message:'Method not allowed' });
  }

  const { feedback } = req.body || {};
  if (!feedback || typeof feedback !== 'string' || !feedback.trim()) {
    return res.status(400).json({ ok:false, message:'Feedback kosong' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chat) {
    return res.status(500).json({ ok:false, message:'Server belum dikonfigurasi' });
  }

  const text = `📩 Masukan anonim:\n\n${feedback.trim()}`;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const body = new URLSearchParams({ chat_id: chat, text });

  try {
    const r = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body: body.toString()
    });

    const d = await r.json();

    if (!d.ok) {
      return res.status(500).json({ ok:false, message:'Gagal kirim Telegram' });
    }

    return res.json({ ok:true, message:'Terkirim' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok:false, message:'Terjadi kesalahan server' });
  }
}
