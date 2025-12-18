import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from '../../utils/request';
import RoleEdit from './RoleEdit';
import type { Role } from './RoleEdit';

type ApiResponse<T> = {
  code: number;
  data: T;
  msg?: string;
};

const RoleList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const queryClient = useQueryClient();

  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = (await request.get('/system/role/list')) as unknown as ApiResponse<Role[]>;
      return res.data;
    },
  });

  // Docs don't explicitly mention DELETE role, but usually it exists.
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await request.delete(`/system/role/${id}`);
    },
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: () => {
        message.error('删除失败，可能该角色已被使用或API不支持');
    }
  });

  const handleAdd = () => {
    setCurrentRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Role) => {
    setCurrentRole(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentRole(null);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setCurrentRole(null);
    queryClient.invalidateQueries({ queryKey: ['roles'] });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '角色代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Role) => (
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
          添加角色
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={isLoading}
      />
      <Modal
        title={currentRole ? '编辑角色' : '添加角色'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        destroyOnHidden
        width={600}
      >
        <RoleEdit
          initialValues={currentRole}
          onSuccess={handleSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default RoleList;
