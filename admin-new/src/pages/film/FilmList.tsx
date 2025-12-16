import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from '../../utils/request';
import FilmEdit from './FilmEdit';
import type { Film } from './FilmEdit';

const FilmList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);
  const queryClient = useQueryClient();

  const { data: films, isLoading } = useQuery({
    queryKey: ['films'],
    queryFn: async () => {
      const res: any = await request.get('/film/all');
      return res.data?.map((item: any) => ({
        ...item,
        id: item.filmId
      })) || [];
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

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
      render: (_: any, record: Film) => (
        <Space size="middle">
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
    </div>
  );
};

export default FilmList;
