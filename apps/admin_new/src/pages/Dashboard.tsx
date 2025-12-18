import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Statistic, Table } from 'antd';
import { UserOutlined, VideoCameraOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import request from '../utils/request';

type ApiResponse<T> = {
  code: number;
  data: T;
  msg?: string;
};

type StatsOverview = {
  userCount: number;
  filmCount: number;
  bookingCount: number;
  revenueTotal: number;
};

type TopFilm = {
  filmId: number;
  filmName: string;
  tickets: number;
  revenue: number;
};

  const Dashboard: React.FC = () => {
  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['statsOverview'],
    queryFn: async () => {
      const res = (await request.get('/stats/overview')) as unknown as ApiResponse<StatsOverview>;
      return res.data;
    },
  });

  const { data: topFilms, isLoading: isTopFilmsLoading } = useQuery({
    queryKey: ['topFilms'],
    queryFn: async () => {
      const res = (await request.get(
        '/stats/topFilms?from=2018-01-01&to=2025-12-31&limit=10'
      )) as unknown as ApiResponse<TopFilm[]>;
      return res.data;
    },
  });

  const columns = [
    {
      title: '电影名称',
      dataIndex: 'filmName',
      key: 'filmName',
    },
    {
      title: '售出票数',
      dataIndex: 'tickets',
      key: 'tickets',
    },
    {
      title: '票房收入 (元)',
      dataIndex: 'revenue',
      key: 'revenue',
    },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={overview?.userCount}
              prefix={<UserOutlined />}
              loading={isOverviewLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="电影总数"
              value={overview?.filmCount}
              prefix={<VideoCameraOutlined />}
              loading={isOverviewLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={overview?.bookingCount}
              prefix={<ShoppingCartOutlined />}
              loading={isOverviewLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收入"
              value={overview?.revenueTotal}
              prefix={<DollarOutlined />}
              precision={2}
              loading={isOverviewLoading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
         <Col span={24}>
           <Card title="热门电影 TOP 5">
             <Table
               dataSource={topFilms ?? []}
               columns={columns}
               rowKey="filmId"
               loading={isTopFilmsLoading}
               pagination={false}
             />
           </Card>
         </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
