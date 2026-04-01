// api/search.js
export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允许 POST 请求' });
    }

    // 从前端拿到用户想搜的角色名
    const { character } = req.body;

    // 🔒 核心机密：这里的 process.env.N8N_START_URL 就是环境变量，全宇宙只有你知道
    const n8nUrl = process.env.N8N_START_URL;

    try {
        // 后端替你去请求 n8n，客户根本不知道 n8n 的存在
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ character })
        });

        res.status(200).json({ success: true, message: "指令已成功发送给后台" });
    } catch (error) {
        res.status(500).json({ error: '后台引擎请求失败' });
    }
}