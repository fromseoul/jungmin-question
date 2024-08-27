import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useBoardDetailQuery } from './hooks/userBoardDetailQuery';
import { Avatar, Button, Form, Image, Input, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import JungminModal from '../../components/JungminModal';

const { Title } = Typography;

function FreeBoardDetail() {
  const { id, mode } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const [form] = useForm();

  const [deleteModal, setDeleteModal] = useState(false);

  const { data, isLoading } = useBoardDetailQuery(id!);

  useEffect(() => {
    if (mode === 'edit') {
      form.setFieldsValue({
        title: data?.title,
        body: data?.body,
      });
    }
  }, [form, mode, data?.title, data?.body]);

  const onDelete = () => {
    setDeleteModal(true);
  };

  const onListReturn = () => {
    navigate(-1);
  };

  const onUpdate = () => {
    navigate(`${location.pathname}/edit`);
  };

  const onDeleteOk = async () => {
    // 삭제 API 호출
    // try {
    // } catch (error) {
    //   console.error('Error removing lock:', error);
    // }
    await navigate(-1);
  };

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Form form={form}>
        <Form.Item name="title">{mode === 'edit' ? <Input /> : <Title level={2}>{data.title}</Title>}</Form.Item>
        <Form.Item name="user-info">
          <Avatar style={{ marginRight: '8px' }} icon={<Image src={data.user.avatar_url} />} />
          <span style={{ marginRight: '8px' }}>{data.user.login}</span>
          <span>{dayjs(data.created_at).format('YYYY-MM-DD HH:mm:ss')}</span>
        </Form.Item>
      </Form>
      <Input.TextArea maxLength={10} value={data.body} readOnly={mode !== 'edit'} autoSize={{ minRows: 20 }} />
      <Space style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" onClick={onUpdate}>
            수정
          </Button>
          <Button onClick={onDelete}>삭제</Button>
        </Space>
        {mode !== 'edit' && <Button onClick={onListReturn}>목록</Button>}
      </Space>
      {deleteModal && (
        <JungminModal onCancel={() => setDeleteModal(false)} onOk={onDeleteOk} cancelText="취소" open={deleteModal}>
          정말 삭제하시겠습니까?
        </JungminModal>
      )}
    </>
  );
}

export default FreeBoardDetail;
