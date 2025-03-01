import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'apps.json');

// 启用 CORS 和 JSON 解析中间件
app.use(cors());
app.use(express.json());

// 确保数据文件存在
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ apps: [] }));
}

// 读取应用数据
function loadAppsData() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取应用数据失败:', error);
        return { apps: [] };
    }
}

// 保存应用数据
function saveAppsData(apps) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify({ apps }, null, 2));
    } catch (error) {
        console.error('保存应用数据失败:', error);
    }
}

// 获取所有应用
app.get('/api/apps', (req, res) => {
    const data = loadAppsData();
    res.json(data.apps);
});

// 添加新应用
app.post('/api/apps', (req, res) => {
    const newApp = req.body;
    const data = loadAppsData();
    data.apps.push(newApp);
    saveAppsData(data.apps);
    res.json({ message: '应用添加成功', app: newApp });
});

// 删除应用
app.delete('/api/apps/:name', (req, res) => {
    const appName = req.params.name;
    const data = loadAppsData();
    const index = data.apps.findIndex(app => app.name === appName);
    
    if (index === -1) {
        res.status(404).json({ message: '应用不存在' });
        return;
    }
    
    data.apps.splice(index, 1);
    saveAppsData(data.apps);
    res.json({ message: '应用删除成功' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});