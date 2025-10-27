export default function handler(req, res) {
  const messages = [
    "今天的風也有你的味道。",
    "睡著的樣子，還是一樣可愛。",
    "有光的地方，我都想起你。"
  ];
  const pick = messages[Math.floor(Math.random() * messages.length)];
  res.status(200).json({ message: pick });
}

