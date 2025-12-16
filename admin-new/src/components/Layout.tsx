import React from 'react';
import { Layout as AntLayout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  VideoCameraOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Dropdown, Space, Avatar } from 'antd';

const { Header, Sider, Content } = AntLayout;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Handle legacy admin role mapping
  const role = user.role === 'admin' ? 'super_admin' : user.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userMenu = {
    items: [
      {
        key: 'logout',
        label: '退出登录',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      },
    ],
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      roles: ['super_admin', 'finance', 'cinema_admin', 'operator'],
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/films',
      icon: <VideoCameraOutlined />,
      label: '电影管理',
      roles: ['super_admin', 'operator', 'cinema_admin'],
      onClick: () => navigate('/films'),
    },
    {
      key: '/cinemas',
      icon: <AppstoreOutlined />,
      label: '影厅管理',
      roles: ['super_admin', 'cinema_admin'],
      onClick: () => navigate('/cinemas'),
    },
     {
      key: '/roles',
      icon: <TeamOutlined />,
      label: '角色权限',
      roles: ['super_admin'],
      onClick: () => navigate('/roles'),
    },
  ];

  const items = menuItems.filter(item => item.roles.includes(role));

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
           <Dropdown menu={userMenu}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} src={user.avatar} />
                <span>{user.name || user.userName}</span>
              </Space>
           </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
