const path = require("path")

module.exports = {
    webpack: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    devServer: {
        proxy: {
            "/api/admin/v1": {
                // target: "http://127.0.0.1:8000",
                target: "https://webfolio-admin.zixuanzheng.com",
                changeOrigin: true,
            },
        },
    },
}
