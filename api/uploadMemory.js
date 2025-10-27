import { createClient } from '@supabase/supabase-js'

// 初始化 Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// CORS 設定（讓 Lovable 可以呼叫）
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  return await fn(req, res)
}

async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { petName, note } = req.body
      console.log('📩 Received message:', petName, note)

      const { data, error } = await supabase
        .from('memories')
        .insert([{ pet_name: petName || '未命名', note }])
        .select()

      if (error) {
        console.error('❌ Supabase insert error:', error)
        throw error
      }

      return res.status(200).json({ success: true, data })
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.status(200).json(data)
    }

    res.status(405).end()
  } catch (err) {
    console.error('❌ UploadMemory crash:', err)
    res.status(500).json({ success: false, error: err.message })
  }
}

export default allowCors(handler)
