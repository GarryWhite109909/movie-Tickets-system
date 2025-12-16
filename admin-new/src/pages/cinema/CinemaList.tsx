import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from '../../utils/request';
import CinemaEdit from './CinemaEdit';
import type { Room } from './CinemaEdit';

const CinemaList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res: any = await request.get('/cinema/room/list');
      return res.data?.map((item: any) => ({
        ...item,
        id: item.roomId
      })) || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await request.delete(`/cinema/room/${id}`);
    },
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const handleAdd = () => {
    setCurrentRoom(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Room) => {
    setCurrentRoom(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentRoom(null);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setCurrentRoom(null);
    queryClient.invalidateQueries({ queryKey: ['rooms'] });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '放映厅名称',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: '编号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '行数',
      dataIndex: 'row',
      key: 'row',
    },
    {
      title: '列数',
      dataIndex: 'column',
      key: 'column',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Room) => (
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
          添加放映厅
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={rooms}
        rowKey="id"
        loading={isLoading}
      />
      <Modal
        title={currentRoom ? '编辑放映厅' : '添加放映厅'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        destroyOnHidden
      >
        <CinemaEdit
          initialValues={currentRoom}
          onSuccess={handleSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default CinemaList;
