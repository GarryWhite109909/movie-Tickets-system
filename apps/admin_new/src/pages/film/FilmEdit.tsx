import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import request from '../../utils/request';
import dayjs, { type Dayjs } from 'dayjs';

type FilmFormValues = Omit<Film, 'id' | 'onTime'> & {
  onTime?: Dayjs | null;
};

export interface Film {
  id?: number;
  filmName: string;
  englishName: string;
  introduction: string;
  directors: string;
  performers: string;
  filmTime: string;
  onTime: string;
  poster?: string;
}

interface FilmEditProps {
  initialValues?: Film | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const FilmEdit: React.FC<FilmEditProps> = ({ initialValues, onSuccess, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        onTime: initialValues.onTime ? dayjs(initialValues.onTime) : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = async (values: FilmFormValues) => {
    try {
      const data = {
        ...values,
        onTime: values.onTime ? values.onTime.format('YYYY-MM-DD') : null,
      };

      if (initialValues?.id) {
        await request.put(`/film/${initialValues.id}`, data);
        message.success('更新成功');
      } else {
        await request.post('/film', data);
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
        name="filmName"
        label="电影名称"
        rules={[{ required: true, message: '请输入电影名称' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="englishName"
        label="英文名称"
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="poster"
        label="海报URL"
      >
        <Input placeholder="/uploads/..." />
      </Form.Item>
       {/* TODO: Implement actual file upload if needed, for now using string input as per API docs body example which usually implies string path or separate upload flow */}
      <Form.Item
        name="introduction"
        label="简介"
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="directors"
        label="导演"
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="performers"
        label="演员"
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="filmTime"
        label="时长"
      >
        <Input placeholder="例如: 120分钟" />
      </Form.Item>
      <Form.Item
        name="onTime"
        label="上映时间"
      >
        <DatePicker style={{ width: '100%' }} />
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

export default FilmEdit;
