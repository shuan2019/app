import { config } from './data.js';

// 获取API基础URL
const getBaseUrl = () => {
    // 使用window.location.hostname判断环境
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocalhost ? 'http://localhost:3000' : '';
};

// 从服务器加载应用数据
async function loadAppsFromServer() {
    try {
        const response = await fetch(`${getBaseUrl()}/api/apps`);
        apps = await response.json();
        renderApps(apps);
    } catch (error) {
        console.error('加载应用数据失败:', error);
        apps = [];
    }
}

// 保存应用数据到服务器
async function saveAppToServer(newApp) {
    try {
        const response = await fetch(`${getBaseUrl()}/api/apps`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newApp)
        });
        if (!response.ok) {
            throw new Error('保存应用失败');
        }
        await loadAppsFromServer(); // 重新加载数据
    } catch (error) {
        console.error('保存应用数据失败:', error);
        alert('保存应用数据失败！');
    }
}

let isAuthenticated = false;
let apps = [];

// 打开上传模态框
async function openUploadModal() {
    const isValid = await verifyPassword('add');
    if (!isValid) {
        alert('密码错误！');
        return;
    }
    isAuthenticated = true;
    document.getElementById('uploadModal').style.display = 'block';
}

// 关闭上传模态框
function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
}

// 上传应用
async function submitApp() {
    if (!isAuthenticated) {
        return;
    }

    const newApp = {
        name: document.getElementById('appName').value,
        description: document.getElementById('appDescription').value,
        icon: document.getElementById('appIcon').value,
        downloadUrl: document.getElementById('appDownloadUrl').value,
        size: '未知',
        uploadTime: new Date().toLocaleDateString()
    };

    await saveAppToServer(newApp);
    closeUploadModal();
    alert('应用上传成功！');

    // 清空表单
    document.getElementById('appName').value = '';
    document.getElementById('appDescription').value = '';
    document.getElementById('appIcon').value = '';
    document.getElementById('appDownloadUrl').value = '';
}

// 密码验证
function verifyPassword(action) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'password-modal';
        modal.innerHTML = `
            <div class="password-modal-content">
                <h2 class="password-modal-title">请输入密码以${action === 'delete' ? '删除' : '添加'}应用</h2>
                <div class="password-input-group">
                    <input type="password" class="password-input" placeholder="请输入密码">
                </div>
                <div class="password-modal-buttons">
                    <button class="password-modal-btn password-confirm-btn">确认</button>
                    <button class="password-modal-btn password-cancel-btn">取消</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        const input = modal.querySelector('.password-input');
        const confirmBtn = modal.querySelector('.password-confirm-btn');
        const cancelBtn = modal.querySelector('.password-cancel-btn');

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        };

        confirmBtn.addEventListener('click', () => {
            const password = input.value;
            closeModal();
            resolve(password === config.adminPassword);
        });

        cancelBtn.addEventListener('click', () => {
            closeModal();
            resolve(false);
        });
    });
}

// 删除应用
async function deleteApp(appName) {
    const isValid = await verifyPassword('delete');
    if (!isValid) {
        alert('密码错误！');
        return;
    }

    if (confirm('确定要删除这个应用吗？')) {
        try {
            const response = await fetch(`${getBaseUrl()}/api/apps/${appName}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('删除应用失败');
            }
            await loadAppsFromServer(); // 重新加载数据
            alert('应用删除成功！');
        } catch (error) {
            console.error('删除应用失败:', error);
            alert('删除应用失败！');
        }
    }
}

// 搜索应用
function searchApps() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredApps = apps.filter(app => 
        app.name.toLowerCase().includes(searchTerm) || 
        app.description.toLowerCase().includes(searchTerm)
    );
    renderApps(filteredApps);
}

// 渲染应用列表
function renderApps(appsToRender) {
    const appGrid = document.getElementById('appGrid');
    appGrid.innerHTML = '';

    appsToRender.forEach((app, index) => {
        const appCard = document.createElement('div');
        appCard.className = 'app-card';
        appCard.innerHTML = `
            <img src="${app.icon}" alt="${app.name}" class="app-icon">
            <h3 class="app-name">${app.name}</h3>
            <p class="app-description">${app.description}</p>
            <p class="app-info">大小: ${app.size} | 上传时间: ${app.uploadTime}</p>
            <div class="app-buttons">
                <button class="download-btn" onclick="window.open('${app.downloadUrl}', '_blank')">下载</button>
                <button class="delete-btn" onclick="deleteApp('${app.name}')">删除</button>
            </div>
        `;
        appGrid.appendChild(appCard);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadAppsFromServer();
});

// 导出需要的函数
window.openUploadModal = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.submitApp = submitApp;
window.deleteApp = deleteApp;
window.searchApps = searchApps;

// 搜索图标
async function searchIcons() {
    const searchTerm = document.getElementById('iconSearchInput').value.trim();
    if (!searchTerm) {
        alert('请输入搜索关键词');
        return;
    }

    const spinner = document.getElementById('iconLoadingSpinner');
    const iconGrid = document.getElementById('iconGrid');
    spinner.style.display = 'block';
    iconGrid.innerHTML = '';

    try {
        const response = await fetch(`${config.iconSearchApi}?appkey=${config.iconSearchApiKey}&query=${encodeURIComponent(searchTerm)}&page=1&size=20`);
        const data = await response.json();

        if (data.pages && data.pages.elements) {
            data.pages.elements.forEach(icon => {
                const iconItem = document.createElement('div');
                iconItem.className = 'icon-item';
                iconItem.innerHTML = `<img src="${icon.url}" alt="${icon.name}">`;
                iconItem.onclick = () => selectIcon(icon.url);
                iconGrid.appendChild(iconItem);
            });
        }
    } catch (error) {
        console.error('搜索图标时出错:', error);
        alert('搜索图标时出错，请稍后重试');
    } finally {
        spinner.style.display = 'none';
    }
}

// 选择图标
function selectIcon(iconUrl) {
    document.getElementById('appIcon').value = iconUrl;
    const iconItems = document.querySelectorAll('.icon-item');
    iconItems.forEach(item => item.classList.remove('selected'));
    const selectedItem = Array.from(iconItems).find(item => 
        item.querySelector('img').src === iconUrl
    );
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
}

// 导出所需的函数
export {
    openUploadModal,
    closeUploadModal,
    submitApp as uploadApp,
    deleteApp,
    searchApps,
    searchIcons,
    selectIcon
};

// 初始化
document.getElementById('appSection').style.display = 'block';
loadAppsFromServer();