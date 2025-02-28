// 应用数据
const apps = [
    {
        name: '示例应用1',
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMzNDk4ZGIiLz48dGV4dCB4PSIzMiIgeT0iMzIiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMjQiPkExPC90ZXh0Pjwvc3ZnPg==',
        description: '这是一个示例应用描述',
        downloadUrl: '#',
        size: '1.2MB',
        uploadTime: '2024-01-20'
    },
    {
        name: '示例应用2',
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMyN2FlNjAiLz48dGV4dCB4PSIzMiIgeT0iMzIiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMjQiPkEyPC90ZXh0Pjwvc3ZnPg==',
        description: '另一个示例应用描述',
        downloadUrl: '#',
        size: '2.3MB',
        uploadTime: '2024-01-21'
    }
];

// 配置信息
const config = {
    adminPassword: '881223',
    iconSearchApi: 'https://iconsapi.com/api/search',
    iconSearchApiKey: '67bc5c57e4b048030141b501'
};

// 导出数据和配置
export { apps, config };