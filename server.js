import express from 'express';
import cors from 'cors';
import { getAllApps, addApp, deleteApp } from './db.js';

const app = express();
const port = 3000;

// 启用 CORS 和 JSON 解析中间件
app.use(cors());
app.use(express.json());

// 获取所有应用
app.get('/api/apps', async (req, res) => {
    try {
        const apps = await getAllApps();
        res.json(apps);
    } catch (error) {
        console.error('获取应用数据失败:', error);
        res.status(500).json({ message: '获取应用数据失败' });
    }
});

// 添加新应用
app.post('/api/apps', async (req, res) => {
    try {
        const newApp = req.body;
        await addApp(newApp);
        res.json({ message: '应用添加成功', app: newApp });
    } catch (error) {
        console.error('添加应用失败:', error);
        res.status(500).json({ message: '添加应用失败' });
    }
});

// 删除应用
app.delete('/api/apps/:name', async (req, res) => {
    try {
        const appName = req.params.name;
        const result = await deleteApp(appName);
        
        if (result.deletedCount === 0) {
            res.status(404).json({ message: '应用不存在' });
            return;
        }
        
        res.json({ message: '应用删除成功' });
    } catch (error) {
        console.error('删除应用失败:', error);
        res.status(500).json({ message: '删除应用失败' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});