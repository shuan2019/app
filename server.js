const express = require('express');
const cors = require('cors');

const app = express();

// 使用内存存储替代文件系统
let appsData = { apps: [] };

// 启用 CORS 和 JSON 解析中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
});

// 读取应用数据
function loadAppsData() {
    return appsData;
}

// 保存应用数据
function saveAppsData(apps) {
    appsData.apps = apps;
}

// 获取所有应用
app.get('/api/apps', (req, res) => {
    try {
        const data = loadAppsData();
        res.json(data.apps);
    } catch (error) {
        console.error('获取应用数据失败:', error);
        res.status(500).json({ message: '获取应用数据失败' });
    }
});

// 添加新应用
app.post('/api/apps', (req, res) => {
    try {
        const newApp = req.body;
        if (!newApp || !newApp.name) {
            return res.status(400).json({ message: '无效的应用数据' });
        }
        const data = loadAppsData();
        data.apps.push(newApp);
        saveAppsData(data.apps);
        res.json({ message: '应用添加成功', app: newApp });
    } catch (error) {
        console.error('添加应用失败:', error);
        res.status(500).json({ message: '添加应用失败' });
    }
});

// 删除应用
app.delete('/api/apps/:index', (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const data = loadAppsData();
        
        if (isNaN(index) || index < 0 || index >= data.apps.length) {
            return res.status(404).json({ message: '应用不存在' });
        }
        
        data.apps.splice(index, 1);
        saveAppsData(data.apps);
        res.json({ message: '应用删除成功' });
    } catch (error) {
        console.error('删除应用失败:', error);
        res.status(500).json({ message: '删除应用失败' });
    }
});

// 错误处理中间件 - 放在所有路由之后
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || '服务器内部错误'
    });
});

// 处理 404 错误
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: '请求的资源不存在'
    });
});

// 导出应用实例
module.exports = app;