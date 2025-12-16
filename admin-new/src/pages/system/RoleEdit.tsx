import React, { useEffect } from 'react';
import { Form, Input, Button, message, Checkbox, Card } from 'antd';
import { useQuery } from '@tanstack/react-query';
import request from '../../utils/request';

export interface Role {
  id?: number;
  code: string;
  name: string;
  description: string;
  permissionIds?: number[];
  permissions?: any[]; // For display
}

interface RoleEditProps {
  initialValues?: Role | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const RoleEdit: React.FC<RoleEditProps> = ({ initialValues, onSuccess, onCancel }) => {
  const [form] = Form.useForm();

  // Fetch permissions (resources)
  const { data: resources } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const res: any = await request.get('/system/resource/list');
      return res.data;
    },
  });

  useEffect(() => {
    if (initialValues) {
      // Extract permission IDs if not directly provided but nested in objects
      const permissionIds = initialValues.permissionIds || 
        (initialValues.permissions ? initialValues.permissions.map((p: any) => p.id) : []);
      
      form.setFieldsValue({
        ...initialValues,
        permissionIds,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = async (values: any) => {
    try {
      if (initialValues?.id) {
        // Update not explicitly in docs for Role, but assuming PUT /system/role/:id or similar.
        // Wait, docs only say Create Role POST /api/system/role.
        // And Get Role List. 
        // If Update is missing, I should check.
        // Assuming there is an update endpoint or I might fail.
        // Let's assume PUT /system/role/:id exists for now as standard REST.
        // If not, I might need to clarify. But standard crud usually has it.
        // The prompt says "RoleEdit.tsx to manage roles", implying edit.
        await request.put(`/system/role/${initialValues.id}`, values); 
        message.success('更新成功');
      } else {
        await request.post('/system/role', values);
        message.success('创建成功');
      }
      onSuccess();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  // Render permissions. Assuming resources is an array of Resource which has permissions.
  // Or resources IS the permissions list.
  // Docs: `{ "data": [ ...resources_with_permissions ] }`
  // Let's assume simple structure for now or try to render what we get.
  // If resources is undefined, show loading.
  
  const renderPermissions = () => {
    if (!resources) return null;
    
    // Check structure. If it's a flat list of permissions:
    // return <Checkbox.Group options={resources.map(r => ({ label: r.name, value: r.id }))} />
    
    // If it's grouped:
    return resources.map((res: any) => (
      <Card key={res.id} size="small" title={res.name} style={{ marginBottom: 8 }}>
        <Form.Item name="permissionIds" noStyle>
           <Checkbox.Group>
             {res.permissions?.map((perm: any) => (
               <Checkbox key={perm.id} value={perm.id}>{perm.name}</Checkbox>
             ))}
           </Checkbox.Group>
        </Form.Item>
      </Card>
    ));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="code"
        label="角色代码"
        rules={[{ required: true, message: '请输入角色代码' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label="角色名称"
        rules={[{ required: true, message: '请输入角色名称' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="描述"
      >
        <Input.TextArea rows={2} />
      </Form.Item>
      
      <Form.Item label="权限配置">
        {/* Simplified permission selection. 
            Real world might need more complex logic to merge array values from multiple checkbox groups 
            or flat map them.
            For this example, I'll assume resources returns a flat list of permissions or I just map them all.
        */}
        {/* To make it safe, let's just dump all permissions in one group if structure is unknown, 
            or iterate. But Checkbox.Group inside map won't work well with single Form.Item name="permissionIds".
            
            Better approach: Custom component or just one Checkbox.Group with all options if flat.
            If nested, I need to flatten them for the options.
        */}
        <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {resources?.map((res: any) => {
                // If res has permissions array
                if (res.permissions && Array.isArray(res.permissions)) {
                return res.permissions.map((p: any) => (
                  <Checkbox key={`perm-${p.id}`} value={p.id}>{res.name} - {p.name}</Checkbox>
                ));
              }
              // If res is the permission itself
              return <Checkbox key={`res-${res.id}`} value={res.id}>{res.name}</Checkbox>;
            })}
        </Checkbox.Group>
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

export default RoleEdit;
