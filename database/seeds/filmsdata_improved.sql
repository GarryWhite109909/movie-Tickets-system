/*
 Improved Database Design for Role-Based Access Control (RBAC)
 Implements resource-based permissions and fine-grained roles.
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 1. Improved Role Table
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL COMMENT 'Role Code (e.g., admin, finance)',
  `name` varchar(50) NOT NULL COMMENT 'Display Name',
  `description` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1' COMMENT '1: Enabled, 0: Disabled',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='System Roles';

-- Initial Data for Roles
INSERT INTO `sys_role` (`code`, `name`, `description`) VALUES
('super_admin', '超级管理员', '拥有系统所有权限'),
('cinema_admin', '影院管理员', '负责影院日常运营，如排片、影厅管理'),
('finance', '财务人员', '负责订单统计、财务报表查看'),
('operator', '运营人员', '负责影片上下架、轮播图管理'),
('user', '普通用户', 'C端注册用户');

-- ----------------------------
-- 2. Resource/Module Table
-- ----------------------------
DROP TABLE IF EXISTS `sys_resource`;
CREATE TABLE `sys_resource` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL COMMENT 'Resource Code (e.g., film, order)',
  `name` varchar(50) NOT NULL COMMENT 'Resource Name',
  `parentId` bigint(20) DEFAULT '0' COMMENT 'Parent Resource ID',
  `sort` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='System Resources';

-- Initial Data for Resources
INSERT INTO `sys_resource` (`code`, `name`) VALUES
('film', '影片管理'),
('room', '影厅管理'),
('arrange', '排片管理'),
('order', '订单管理'),
('user', '用户管理'),
('system', '系统设置');

-- ----------------------------
-- 3. Permission Table (Fine-grained)
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `resourceId` bigint(20) NOT NULL,
  `code` varchar(100) NOT NULL COMMENT 'Permission Code (e.g., film:add)',
  `name` varchar(100) NOT NULL COMMENT 'Permission Name',
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_resource` (`resourceId`),
  CONSTRAINT `fk_perm_resource` FOREIGN KEY (`resourceId`) REFERENCES `sys_resource` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='System Permissions';

-- Initial Data for Permissions (Example for Film)
INSERT INTO `sys_permission` (`resourceId`, `code`, `name`) 
SELECT id, 'film:view', '查看影片' FROM `sys_resource` WHERE code = 'film';
INSERT INTO `sys_permission` (`resourceId`, `code`, `name`) 
SELECT id, 'film:add', '新增影片' FROM `sys_resource` WHERE code = 'film';
INSERT INTO `sys_permission` (`resourceId`, `code`, `name`) 
SELECT id, 'film:edit', '编辑影片' FROM `sys_resource` WHERE code = 'film';
INSERT INTO `sys_permission` (`resourceId`, `code`, `name`) 
SELECT id, 'film:delete', '删除影片' FROM `sys_resource` WHERE code = 'film';

-- Initial Data for Permissions (Example for Order)
INSERT INTO `sys_permission` (`resourceId`, `code`, `name`) 
SELECT id, 'order:view', '查看订单' FROM `sys_resource` WHERE code = 'order';
INSERT INTO `sys_permission` (`resourceId`, `code`, `name`) 
SELECT id, 'order:refund', '订单退款' FROM `sys_resource` WHERE code = 'order';

-- ----------------------------
-- 4. Role-Permission Association
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission` (
  `roleId` bigint(20) NOT NULL,
  `permissionId` bigint(20) NOT NULL,
  PRIMARY KEY (`roleId`, `permissionId`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`roleId`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permissionId`) REFERENCES `sys_permission` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Role-Permission Mapping';

-- Grant all permissions to Super Admin
INSERT INTO `sys_role_permission` (`roleId`, `permissionId`)
SELECT r.id, p.id FROM `sys_role` r, `sys_permission` p WHERE r.code = 'super_admin';

-- Grant View/Refund permissions to Finance
INSERT INTO `sys_role_permission` (`roleId`, `permissionId`)
SELECT r.id, p.id FROM `sys_role` r JOIN `sys_permission` p ON p.code LIKE 'order:%' WHERE r.code = 'finance';

SET FOREIGN_KEY_CHECKS = 1;
