import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import request from '../../utils/request';

type RoomFormValues = Omit<Room, 'id'>;

export interface Room {
  id?: number;
  roomName: string;
  number: string;
  row: number;
  column: number;
}

interface CinemaEditProps {
  initialValues?: Room | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CinemaEdit: React.FC<CinemaEditProps> = ({ initialValues, onSuccess, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = async (values: RoomFormValues) => {
    try {
      if (initialValues?.id) {
        await request.put(`/cinema/room/${initialValues.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/cinema/room', values);
        message.success('创建成功');
      }
      onSuccess();
    } catch {
      // Error handled by interceptor
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="roomName"
        label="放映厅名称"
        rules={[{ required: true, message: '请输入放映厅名称' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="number"
        label="编号"
        rules={[{ required: true, message: '请输入编号' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="row"
        label="行数"
        rules={[{ required: true, message: '请输入行数' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="column"
        label="列数"
        rules={[{ required: true, message: '请输入列数' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          保存
        </Button>
        <Button onClick={onCancel}>
          取消
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CinemaEdit;
