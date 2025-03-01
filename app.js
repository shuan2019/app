import { config } from './data.js';

let isAuthenticated = false;
let apps = [];

// 从本地存储加载应用数据
function loadAppsFromStorage() {
    const storedApps = localStorage.getItem('apps');
    if (storedApps) {
        apps = JSON.parse(storedApps);
    } else {
        // 如果本地存储为空，使用默认应用数据
        apps = window.defaultApps || [];
        saveAppsToStorage();
    }
}

// 保存应用数据到本地存储
function saveAppsToStorage() {
    localStorage.setItem('apps', JSON.stringify(apps));
}

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

    apps.push(newApp);
    saveAppsToStorage();
    renderApps(apps);
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

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });

        input.focus();
    });
}

// 下载应用
function downloadApp(appName) {
    const app = apps.find(a => a.name === appName);
    if (app) {
        window.location.href = app.downloadUrl;
    }
}

// 删除应用
async function deleteApp(appName) {
    const isValid = await verifyPassword('delete');
    if (!isValid) {
        alert('密码错误！');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/apps/${appName}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('删除应用失败');
        }
        await loadAppsFromServer(); // 重新加载最新数据
        alert('应用删除成功！');
    } catch (error) {
        console.error('删除应用失败:', error);
        alert('删除应用失败，请检查网络连接');
    }
}

// 渲染应用列表
function renderApps(appsToRender) {
    const appGrid = document.getElementById('appGrid');
    appGrid.innerHTML = '';
    
    appsToRender.forEach(app => {
        const appCard = document.createElement('div');
        appCard.className = 'app-card';
        appCard.innerHTML = `
            <img src="${app.icon}" alt="${app.name}" class="app-icon">
            <div class="app-name">${app.name}</div>
            <div class="app-description">${app.description}</div>
            <div class="app-info">
                <div>上传时间: ${app.uploadTime}</div>
            </div>
            <div class="app-buttons">
                <button class="download-btn" onclick="downloadApp('${app.name}')">下载应用</button>
                <button class="delete-btn" onclick="deleteApp('${app.name}')">删除应用</button>
            </div>
        `;
        appGrid.appendChild(appCard);
    });
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
    downloadApp,
    deleteApp,
    searchApps,
    searchIcons,
    selectIcon
};

// 初始化
document.getElementById('appSection').style.display = 'block';
loadAppsFromServer();