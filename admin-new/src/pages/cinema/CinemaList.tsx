import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from '../../utils/request';
import CinemaEdit from './CinemaEdit';
import type { Room } from './CinemaEdit';

const CinemaList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
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

  const handleLayout = (record: Room) => {
    setCurrentRoom(record);
    setIsLayoutOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentRoom(null);
  };

  const handleLayoutClose = () => {
    setIsLayoutOpen(false);
    setCurrentRoom(null);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setCurrentRoom(null);
    queryClient.invalidateQueries({ queryKey: ['rooms'] });
  };

  const renderSeatLayout = () => {
    if (!currentRoom) return null;
    const { row, column } = currentRoom;
    // Assuming simple full grid for now as per requirement to show "layout".
    // "Occupancy" is not available per hall (it's per screening), so we show "Available" (Green) as capacity.
    
    const rows = [];
    for (let i = 1; i <= row; i++) {
      const seats = [];
      for (let j = 1; j <= column; j++) {
        seats.push(
          <div
            key={`${i}-${j}`}
            style={{
              width: 30,
              height: 30,
              background: '#52c41a', // Green for available/seat exists
              margin: 4,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 10,
              cursor: 'pointer'
            }}
            title={`${i}排${j}座`}
          >
            {j}
          </div>
        );
      }
      rows.push(
        <div key={i} style={{ display: 'flex', marginBottom: 4 }}>
          <div style={{ width: 30, marginRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i}排</div>
          {seats}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'auto', maxHeight: 500 }}>
        <div style={{ marginBottom: 16, width: '80%', height: 20, background: '#e8e8e8', textAlign: 'center', lineHeight: '20px', borderRadius: '0 0 20px 20px' }}>
          银幕
        </div>
        {rows}
        <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
           <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ width: 20, height: 20, background: '#52c41a', marginRight: 4, borderRadius: 4 }} /> 正常座位</div>
           {/* Placeholder for broken/sold if we had that data */}
        </div>
      </div>
    );
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
          <Button icon={<AppstoreOutlined />} onClick={() => handleLayout(record)}>座位</Button>
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

      <Modal
        title={currentRoom ? `${currentRoom.roomName} - 座位布局` : '座位布局'}
        open={isLayoutOpen}
        onCancel={handleLayoutClose}
        footer={[
           <Button key="close" onClick={handleLayoutClose}>关闭</Button>
        ]}
        width={800}
        destroyOnHidden
      >
        {renderSeatLayout()}
      </Modal>
    </div>
  );
};

export default CinemaList;
