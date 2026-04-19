# ItemManSystem

Web版进销存管理系统，用于帮助用户管理商品录入、商品销售以及库存管理。

## 技术栈

- **前端**: Angular 17 + TypeScript
- **后端**: Spring Boot 3.2 + Spring Data JPA
- **数据库**: MySQL 8.0

## 功能特点

- 📦 **商品管理**: 商品的新增、编辑、删除、搜索
- 🛒 **开单卖货**: 购物车模式，支持商品选择、数量调整、自动计算金额，下单自动减库存
- 📋 **库存管理**: 库存查看、低库存预警、库存状态统计
- 📝 **订单历史**: 订单查询、详情查看、订单取消（自动恢复库存）

## 界面特点

- 清爽简洁的设计风格
- 大气精致的卡片式布局
- 暖色调（橙色系）配色，非蓝色系
- 响应式设计，支持移动端
- 精致的微交互动效

## 项目结构

```
ItemManSystem/
├── backend/                    # 后端项目
│   ├── src/main/java/com/itemman/
│   │   ├── config/            # 配置类（跨域等）
│   │   ├── controller/        # REST API 控制器
│   │   │   ├── ProductController.java
│   │   │   ├── OrderController.java
│   │   │   ├── InventoryController.java
│   │   │   └── DashboardController.java
│   │   ├── entity/            # 实体类
│   │   │   ├── Product.java
│   │   │   ├── Order.java
│   │   │   └── OrderItem.java
│   │   ├── exception/         # 异常处理
│   │   ├── repository/        # 数据访问层
│   │   └── service/           # 业务逻辑层
│   ├── src/main/resources/
│   │   └── application.yml    # 应用配置
│   └── pom.xml                # Maven 依赖
├── frontend/                   # 前端项目
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # 组件
│   │   │   │   ├── dashboard/ # 仪表盘
│   │   │   │   ├── nav/       # 导航栏
│   │   │   │   ├── products/  # 商品管理
│   │   │   │   ├── sales/     # 开单卖货
│   │   │   │   ├── inventory/ # 库存管理
│   │   │   │   └── orders/    # 订单历史
│   │   │   ├── models/        # 数据模型
│   │   │   ├── services/      # API 服务
│   │   │   ├── app.component.*
│   │   │   └── app.module.ts
│   │   ├── styles.css         # 全局样式
│   │   ├── index.html
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── angular.json
├── database/
│   └── init.sql               # 数据库初始化脚本
└── README.md
```

## 环境要求

- JDK 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+
- Angular CLI 17+ (可选，用于开发)

## 启动步骤

### 第一步：准备数据库

1. 确保 MySQL 服务已启动

2. 创建数据库并导入初始化脚本：

```bash
# 方式一：使用 MySQL 命令行
mysql -u root -p

# 然后执行
source d:/Annan/AI/anotherWay/trae/solo/20260420/ItemManSystem/database/init.sql

# 方式二：手动执行 SQL 文件内容
# 打开 database/init.sql，在 MySQL 客户端中执行
```

或者手动创建数据库和表：

```sql
CREATE DATABASE itemman CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE itemman;
-- 然后执行 init.sql 中的建表语句
```

3. 检查数据库连接配置：

编辑 `backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/itemman?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root      # 根据实际情况修改
    password: root      # 根据实际情况修改
```

### 第二步：启动后端服务

方式一：使用 Maven 命令

```bash
cd d:/Annan/AI/anotherWay/trae/solo/20260420/ItemManSystem/backend

# 首次运行需要下载依赖
mvn clean install -DskipTests

# 启动应用
mvn spring-boot:run
```

方式二：使用 IDE 启动

- 在 IDE（IntelliJ IDEA 或 Eclipse）中打开 `backend` 目录
- 等待 Maven 依赖下载完成
- 找到 `ItemManApplication.java`，右键运行 `main` 方法

后端服务启动成功后，访问：
- API 地址：`http://localhost:8080`

### 第三步：启动前端服务

方式一：使用 npm 命令

```bash
cd d:/Annan/AI/anotherWay/trae/solo/20260420/ItemManSystem/frontend

# 首次运行需要安装依赖
npm install

# 启动开发服务器
npm start
```

方式二：使用 Angular CLI（如果已安装）

```bash
ng serve
```

前端服务启动成功后，访问：
- 应用地址：`http://localhost:4200`

## 验证方法

### 1. 验证后端 API

打开浏览器或使用 Postman 测试以下接口：

```bash
# 测试商品列表接口
GET http://localhost:8080/api/products

# 测试低库存商品接口
GET http://localhost:8080/api/products/low-stock

# 测试仪表盘数据接口
GET http://localhost:8080/api/dashboard
```

如果返回 JSON 数据，说明后端服务正常。

### 2. 验证前端应用

打开浏览器访问 `http://localhost:4200`，你应该能看到：

1. **仪表盘页面**
   - 显示商品总数、今日订单、今日销售额、库存预警等统计
   - 如果数据库已初始化，会显示示例数据

2. **商品管理**
   - 点击顶部导航「商品管理」
   - 应该能看到示例商品列表
   - 测试「新增商品」功能

3. **开单卖货**
   - 点击顶部导航「开单卖货」
   - 左侧显示可售商品（库存>0）
   - 点击商品添加到购物车
   - 调整数量，点击「确认下单」
   - 下单成功后，商品库存会自动减少

4. **库存管理**
   - 点击顶部导航「库存管理」
   - 查看库存统计和明细
   - 低库存商品会有特殊标记

5. **订单历史**
   - 点击顶部导航「订单历史」
   - 查看刚才创建的订单
   - 点击「详情」查看订单明细
   - 点击「取消」可以取消订单并恢复库存

### 3. 验证核心流程

完整的业务流程验证：

```
1. 商品管理 → 新增商品（设置库存和低库存阈值）
   ↓
2. 开单卖货 → 选择商品 → 调整数量 → 确认下单
   ↓
3. 订单历史 → 查看新订单 → 查看订单详情
   ↓
4. 库存管理 → 查看商品库存是否减少
   ↓
5. 订单历史 → 取消订单 → 库存是否恢复
```

### 4. 验证低库存提醒

1. 在商品管理中，将某商品库存调整到低于阈值
2. 刷新页面，观察：
   - 导航栏「库存管理」右侧会显示红色徽章（库存预警数量）
   - 库存管理页面会显示「库存预警」区域
   - 仪表盘会显示库存预警数量

## 默认配置

| 服务 | 端口 | 地址 |
|------|------|------|
| 后端 API | 8080 | http://localhost:8080 |
| 前端 | 4200 | http://localhost:4200 |
| MySQL | 3306 | localhost:3306 |

## 常见问题

### 1. 后端启动失败：无法连接数据库

检查：
- MySQL 服务是否启动
- 数据库 `itemman` 是否创建
- `application.yml` 中的用户名密码是否正确

### 2. 前端启动失败：依赖缺失

解决：
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### 3. 跨域问题

后端已配置 CORS 允许所有来源访问，如有问题检查 `CorsConfig.java`。

### 4. 订单创建失败：库存不足

系统会自动检查库存，下单时商品数量不能超过当前库存。

## 生产部署

### 后端打包

```bash
cd backend
mvn clean package -DskipTests
```

生成的 JAR 文件：`backend/target/item-man-system-1.0.0.jar`

运行：
```bash
java -jar item-man-system-1.0.0.jar
```

### 前端打包

```bash
cd frontend
npm run build
```

生成的静态文件：`frontend/dist/item-man-frontend/`

可以部署到 Nginx、Apache 等 Web 服务器。

## 开发说明

- 后端采用 Spring Boot + JPA，自动建表，无需手动维护表结构
- 前端采用组件化设计，各功能模块独立
- 样式使用自定义 CSS，无第三方 UI 框架依赖
- API 服务统一在 `services` 目录，便于维护
