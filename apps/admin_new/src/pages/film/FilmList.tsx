import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from '../../utils/request';
import FilmEdit from './FilmEdit';
import type { Film } from './FilmEdit';
import { Descriptions, Image } from 'antd';

type ApiResponse<T> = {
  code: number;
  data: T;
  msg?: string;
};

type FilmApi = Omit<Film, 'id'> & {
  filmId: number;
};

const FilmList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);
  const queryClient = useQueryClient();

  const { data: films, isLoading } = useQuery({
    queryKey: ['films'],
    queryFn: async () => {
      const res = (await request.get('/film/all')) as unknown as ApiResponse<FilmApi[]>;
      const list = res.data ?? [];
      return list.map((item) => ({
        ...item,
        id: item.filmId,
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await request.delete(`/film/${id}`);
    },
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries({ queryKey: ['films'] });
    },
  });

  const handleAdd = () => {
    setCurrentFilm(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Film) => {
    setCurrentFilm(record);
    setIsModalOpen(true);
  };

  const handleView = (record: Film) => {
    setCurrentFilm(record);
    setIsDetailOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentFilm(null);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setCurrentFilm(null);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setCurrentFilm(null);
    queryClient.invalidateQueries({ queryKey: ['films'] });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '电影名称',
      dataIndex: 'filmName',
      key: 'filmName',
    },
    {
      title: '导演',
      dataIndex: 'directors',
      key: 'directors',
    },
    {
      title: '上映时间',
      dataIndex: 'onTime',
      key: 'onTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Film) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>详情</Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => handleDelete(record.id!)}
            okText="是"
            cancelText="否"
          >
            <Button icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加电影
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={films}
        rowKey="id"
        loading={isLoading}
      />
      <Modal
        title={currentFilm ? '编辑电影' : '添加电影'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        destroyOnHidden
      >
        <FilmEdit
          initialValues={currentFilm}
          onSuccess={handleSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
      
      <Modal
        title="电影详情"
        open={isDetailOpen}
        onCancel={handleDetailClose}
        footer={[
          <Button key="close" onClick={handleDetailClose}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentFilm && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="电影名称">{currentFilm.filmName}</Descriptions.Item>
            <Descriptions.Item label="英文名称">{currentFilm.englishName || '-'}</Descriptions.Item>
            <Descriptions.Item label="海报">
              {currentFilm.poster ? <Image width={100} src={currentFilm.poster} /> : '暂无海报'}
            </Descriptions.Item>
            <Descriptions.Item label="导演">{currentFilm.directors}</Descriptions.Item>
            <Descriptions.Item label="演员">{currentFilm.performers}</Descriptions.Item>
            <Descriptions.Item label="时长">{currentFilm.filmTime}</Descriptions.Item>
            <Descriptions.Item label="上映时间">{currentFilm.onTime}</Descriptions.Item>
            <Descriptions.Item label="简介">{currentFilm.introduction}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default FilmList;
