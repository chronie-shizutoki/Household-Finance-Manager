const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com'
    : function (origin, callback) {
      // 开发环境动态允许本地及局域网前端源（支持任意端口）
      const isDev = process.env.NODE_ENV !== 'production'; // 默认视为开发环境
      if (isDev) {
        // 允许所有开发环境源（包括预检请求时origin为undefined的情况）
        if (!origin) return callback(null, true);
        // 扩展本地IP范围，确保覆盖所有开发场景
        const isLocal = origin.startsWith('http://localhost:') || 
                        origin.startsWith('http://127.0.0.1:') || 
                        origin.startsWith('http://192.168.') || 
                        origin.startsWith('http://172.') || 
                        origin.startsWith('http://10.');
        return callback(null, isLocal);
      }
      // 生产环境严格校验
      const allowedOrigins = ['https://yourdomain.com'];
      callback(null, allowedOrigins.includes(origin));
    }, // 开发环境灵活允许本地/局域网源，避免固定端口导致的屏蔽
    credentials: true,
    exposedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
    allowedHeaders: ['Origin', 'Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    maxAge: 86400 // 缓存预检结果24小时
};
const http = require('http');
const fs = require('fs');


const app = express();
const PORT = 3001; // 修改端口为3001，确保与前端代理一致

// 统一CORS配置（移除重复的中间件调用）
app.use(cors(corsOptions)); // 应用优化后的CORS配置

// 定义路由
app.use('/api/expenses', require('./routes/expenses'));

  // 添加请求日志中间件（记录请求路径和时间）
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
  app.use(express.json());
// 挂载消费数据相关路由
const expensesRouter = require('./routes/expenses');
app.use('/api/expenses', expensesRouter);
// 优先处理/src路径的静态资源请求（确保开发模式下源文件正确加载）
  // 开发模式优先加载前端源文件（Vite开发服务器），生产模式加载打包资源
    // 开发模式：代理前端Vite开发服务器
    // 注意：请确保前端Vite服务器在5173端口运行
    // @file 服务端主入口文件
    // @module app
    // @package homemoney-server
    // @project 家庭消费记录管理系统
    // @description 仅开发模式启用前端资源代理中间件
    if (process.env.NODE_ENV === 'development') {
      const { createProxyMiddleware } = require('http-proxy-middleware');

    // 配置前端代理（仅处理非API请求）
      app.use(createProxyMiddleware('/', {
        target: "http://localhost:5173",
        changeOrigin: true,
        logLevel: 'debug',
        pathFilter: (path) => !path.startsWith('/api') // 过滤掉/api路径
}));
  }

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})

// 优先处理/src路径的静态资源请求（最终优化版
const srcPath = path.join(__dirname, '../../client/src');
console.log(`[Static Resource] /src mapped to: ${srcPath}`);

// 优先挂载静态资源（public目录）以处理favicon.ico
  const publicPath = path.join(__dirname, '../public');
  app.use(express.static(publicPath));
  console.log(`[Static Resource] Public directory mounted at: ${publicPath}`);




// 静态资源请求处理中间件（含成功/失败日志及核心服务）
app.use('/src', 
  (req, res, next) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`); // 解析URL获取不带查询参数的路径名
      const filePath = path.join(srcPath, pathname); // 使用pathname构建实际文件路径
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.warn(`[Static Resource] File not found: ${filePath}`); // 记录文件不存在警告
        return next();
      }
      console.log(`[Static Resource] Sending file: ${filePath}`); // 记录成功发送的文件路径
      next();
    });
  },
  express.static(srcPath, {
    extensions: ['js', 'json', 'css'],
    fallthrough: true, // 未找到文件时继续传递请求
    onError: (err, req, res, next) => {
      console.error(`[Static Resource Error] Path: ${req.url}, Error Type: ${err.code}, Message: ${err.message}`);
      const { pathname: errorPathname } = new URL(req.url, `http://${req.headers.host}`);
      console.error(`[Debug] Resolved directory: ${srcPath}, File exists: ${fs.existsSync(path.join(srcPath, errorPathname))}`);
      if (err.code === 'ENOENT') {
        res.status(404).json({ error: '资源未找到' });
      } else {
        // 优化500错误提示，明确具体错误信息
        res.status(500).json({ error: `资源加载失败（${err.code}）：${err.message}，请检查文件权限或内容完整性` });
      }
    }
  })
);

// 生产环境优先返回Vue打包入口，开发环境由代理处理
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}
// 优先托管静态资源，确保资源请求先被处理
app.use(express.static(path.join(__dirname, '../public')));
// 配置exports目录为静态资源，用于CSV文件下载
app.use('/exports', express.static(path.join(__dirname, '../exports')));

// 公共资源服务放在路由之前，避免被API路由拦截

// 处理根路径请求，指向Vue打包后的入口文件
app.get('/', (req, res) => {
  const vueIndexPath = path.join(__dirname, '../../client/dist/index.html');
  res.sendFile(vueIndexPath);
});
// 处理favicon.ico请求
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/favicon.ico')); // 假设public目录有图标文件
});
// 原根路径请求处理
// 处理前端路由请求（仅生产模式生效）
// 通配符路由应放在最后
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    // 指向前端打包后的入口文件
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
  });
}

// 请求超时中间件
app.use((req, res, next) => {
  req.setTimeout(5000, () => {
    res.status(503).json({ error: '请求超时' })
  })
  next()
})

// 增强的错误处理中间件
app.use((err, req, res, next) => {
  console.error('路由错误:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message,
      details: err.details
    },
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const clipboardy = require('clipboardy');

  const ExportService = require('./utils/export');
  const exportService = new ExportService();

  // 挂载消费记录路由
  const expenseRoutes = require('./routes/expenseRoutes');
  app.use(expenseRoutes);

// 挂载基础健康检查路由（从routes目录引入）
const baseRoutes = require('./routes/baseRoutes');
app.use(baseRoutes);

// 挂载导出功能路由（从routes目录引入）
const exportRoutes = require('./routes/exportRoutes');
app.use(exportRoutes);



// 启动服务
http.createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(`家庭消费记录服务已启动（HTTP），访问地址：http://${getLocalIP()}:${PORT}`);
}); // 无SSL证书时回退到HTTP

// 获取局域网IP辅助函数
function getLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}