import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase，用環境變數讀取 URL 及 anon key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// CORS 包裹函式：處理 OPTIONS 預檢，回傳必要標頭
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  return await fn(req, res);
};

async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // 從前端取得留言內容與日期，若沒給日期就用現在時間
      const { message, petName = '金瓜', date } = req.body;
      if (!message) {
        return res.status(400).json({ success: false, error: 'Missing message' });
      }
      const timestamp = date || new Date().toISOString();
      // 將留言寫入 memories 表；欄位名稱需與 Supabase table 對應
      const { data, error } = await supabase
        .from('memories')
        .insert([{ pet_name: petName, note: message, created_at: timestamp }])
        .select();
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    } else if (req.method === 'GET') {
      // 讀取所有留言，依時間由新到舊排序
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    } else {
      // 其他 HTTP 方法不允許
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (err) {
    // 若有錯誤，回傳 500 方便前端判斷
    console.error('UploadMemory error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

export default allowCors(handler);
