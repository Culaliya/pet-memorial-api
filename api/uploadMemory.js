import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// ✅ 允許跨網域（CORS）
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')  // 允許任何來源（含 Lovable）
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  return await fn(req, res)
}

async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { message } = req.body
      const { data, error } = await supabase
        .from('memories')
        .insert([{ pet_name: '金瓜', note: message }])
        .select()

      if (error) throw error
      res.status(200).json({ success: true, data })
    } else if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      res.status(200).json(data)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (err) {
    console.error('UploadMemory Error:', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
}

export default allowCors(handler)
