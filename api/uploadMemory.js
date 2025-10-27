let memories = []; // 暫存於記憶體，日後可改成資料庫

export default function handler(req, res) {
  if (req.method === "POST") {
    const { petName, note } = req.body;
    const entry = { petName, note, time: new Date().toISOString() };
    memories.push(entry);
    res.status(200).json({ success: true, entry });
  } else if (req.method === "GET") {
    res.status(200).json(memories);
  } else {
    res.status(405).end();
  }
}
