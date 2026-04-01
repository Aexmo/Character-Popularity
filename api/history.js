// api/history.js
export default async function handler(req, res) {
    // 1. 强制要求必须是 POST 请求（为了安全传输密码）
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '非法请求方式' });
    }

    // 2. 接收前端传过来的密码
    const { password } = req.body;

    // 3. 终极核验：跟 Vercel 环境变量里的真密码比对
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: '❌ 密码错误，拒绝访问飞书机密库！' });
    }

    // 4. 密码正确，放行拿数据！
    const feishuUrl = process.env.N8N_CHECK_URL + "?page_size=500";

    try {
        const response = await fetch(feishuUrl);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '数据库读取失败' });
    }
}