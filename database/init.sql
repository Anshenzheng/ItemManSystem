CREATE DATABASE IF NOT EXISTS itemman CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE itemman;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL UNIQUE COMMENT '商品编码',
    name VARCHAR(255) NOT NULL COMMENT '商品名称',
    category VARCHAR(100) COMMENT '商品分类',
    unit VARCHAR(50) DEFAULT '个' COMMENT '计量单位',
    purchase_price DECIMAL(10, 2) COMMENT '进货单价',
    selling_price DECIMAL(10, 2) COMMENT '销售单价',
    stock INT DEFAULT 0 COMMENT '库存数量',
    low_stock_threshold INT DEFAULT 10 COMMENT '低库存提醒阈值',
    description TEXT COMMENT '商品描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_code (product_code),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单编号',
    customer_name VARCHAR(255) COMMENT '客户名称',
    customer_phone VARCHAR(20) COMMENT '客户电话',
    total_amount DECIMAL(10, 2) DEFAULT 0.00 COMMENT '订单总金额',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '订单日期',
    status VARCHAR(20) DEFAULT 'COMPLETED' COMMENT '订单状态',
    remark TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_no (order_no),
    INDEX idx_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL COMMENT '订单ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    product_code VARCHAR(50) COMMENT '商品编码',
    product_name VARCHAR(255) NOT NULL COMMENT '商品名称',
    quantity INT NOT NULL COMMENT '数量',
    unit_price DECIMAL(10, 2) NOT NULL COMMENT '单价',
    subtotal DECIMAL(10, 2) NOT NULL COMMENT '小计',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

INSERT INTO products (product_code, name, category, unit, purchase_price, selling_price, stock, low_stock_threshold, description) VALUES
('PROD001', 'A4打印纸', '办公用品', '包', 15.00, 25.00, 100, 20, 'A4规格打印纸，每包500张'),
('PROD002', '中性笔黑色', '办公用品', '支', 1.50, 3.00, 500, 100, '黑色0.5mm中性笔'),
('PROD003', '笔记本', '办公用品', '本', 5.00, 10.00, 50, 10, '32开软面抄笔记本'),
('PROD004', '文件夹', '办公用品', '个', 3.50, 8.00, 30, 5, 'A4双插文件夹'),
('PROD005', '计算器', '办公用品', '台', 25.00, 45.00, 15, 3, '12位数计算器');
