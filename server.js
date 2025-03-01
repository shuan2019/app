const express = require('express');
const cors = require('cors');

const app = express();

// 使用内存存储替代文件系统
let appsData = { apps: [] };

// 启用 CORS 和 JSON 解析中间件
app.use(cors());
app.use(express.json());

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

// 导出应用实例
module.exports = app;