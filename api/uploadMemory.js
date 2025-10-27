let memories = [];

export default function handler(req, res) {
  // 🔧 加上這三行
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // 提前結束 OPTIONS 預檢請求
  }

  if (req.method === "POST") {
    try {
      const { petName, note } = req.body;
      const entry = { petName, note, time: new Date().toISOString() };
      memories.push(entry);
      res.status(200).json({ success: true, entry });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else if (req.method === "GET") {
    res.status(200).json(memories);
  } else {
    res.status(405).end();
  }
}
