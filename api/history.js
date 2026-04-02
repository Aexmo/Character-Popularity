export default async function handler(req, res) {
    // 1. 🚀 强制设置不缓存，彻底击穿 Vercel 服务器缓存！
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // 2. 校验请求逻辑（双通道）
    if (req.method === 'POST') {
        // 通道 A：来自大屏点击【调取历史】按钮，必须严格校验密码！
        const { password } = req.body;
        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ error: '❌ 密码错误，拒绝访问飞书机密库！' });
        }
    } else if (req.method === 'GET') {
        // 通道 B：来自系统后台的自动轮询，无需密码，直接放行！
        // (什么都不用做，直接往下走去查 n8n)
    } else {
        // 拦截其他乱七八糟的请求方式
        return res.status(405).json({ error: '非法请求方式' });
    }

    // 3. 请求放行，去向 n8n 拿数据（加上时间戳彻底防缓存）
    const feishuUrl = process.env.N8N_CHECK_URL + "?page_size=500&_t=" + Date.now();

    try {
        const response = await fetch(feishuUrl, { cache: 'no-store' });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '数据库读取失败' });
    }
}
