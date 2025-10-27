import { createClient } from '@supabase/supabase-js'

// 初始化 Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// 允許跨網域請求（給 Lovable）
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  return await fn(req, res)
}

async function handler(req, res) {
  if (req.method === 'POST') {
    const { petName, note } = req.body
    const { data, error } = await supabase
      .from('memories')
      .insert([{ pet_name: petName, note }])
      .select()
    if (error) return res.status(500).json({ success: false, error })
    res.status(200).json({ success: true, data })
  } else if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ success: false, error })
    res.status(200).json(data)
  } else {
    res.status(405).end()
  }
}

export default allowCors(handler)
