// api/history.js
export default async function handler(req, res) {
    // 🔒 核心机密：飞书的轮询/读取链接，藏在环境变量里
    const feishuUrl = process.env.N8N_CHECK_URL + "?page_size=500";

    try {
        // 后端悄悄去飞书拿数据
        const response = await fetch(feishuUrl);
        const data = await response.json();
        
        // 拿到后，原封不动地端给前端
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '数据库读取失败' });
    }
}