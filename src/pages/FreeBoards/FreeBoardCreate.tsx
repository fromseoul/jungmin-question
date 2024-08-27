import { Button, Form, Input, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const owner = 'octocat';
const repo = 'Spoon-Knife';
const token = process.env.REACT_APP_GITHUB_TOKEN;

function FreeBoardCreate() {
  const [writeTitle, setWriteTitle] = useState('');
  const [writeBody, setWriteBody] = useState('');

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const preventClose = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
  }, []);

  /**
   * 페이지 진입 시 title 필드에 포커스 설정
   */
  useEffect(() => {
    form.getFieldInstance('title').focus();
  }, [form]);

  /**
   * 페이지 나가기, 페이지 새로고침 시 경고창
   */
  useEffect(() => {
    if (writeBody || writeTitle) {
      window.addEventListener('beforeunload', preventClose);
    } else {
      window.removeEventListener('beforeunload', preventClose);
    }
    return () => {
      window.removeEventListener('beforeunload', preventClose);
    };
  }, [writeBody, writeTitle, preventClose]);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWriteTitle(e.target.value);
  };

  const onBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWriteBody(e.target.value);
  };

  const onFinish = async (values: any) => {
    const { title, body } = values;

    try {
      await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          title: title,
          body: body,
          assignees: ['octocat'],
          milestone: 1,
          labels: ['bug'],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );
      await navigate('/');
    } catch (error) {}
  };

  return (
    <Form onFinish={onFinish} form={form}>
      <Title level={2}>게시판</Title>
      <Form.Item
        name="title"
        rules={[
          {
            required: true,
            message: '제목을 입력해주세요.',
          },
        ]}
      >
        <Input placeholder="제목" autoComplete="off" onChange={onTitleChange} />
      </Form.Item>
      <Form.Item
        name="body"
        rules={[
          {
            required: true,
            message: '내용을 입력해주세요.',
          },
        ]}
      >
        <Input.TextArea placeholder="내용" autoComplete="off" rows={20} onChange={onBodyChange} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">등록</Button>
      </Form.Item>
    </Form>
  );
}

export default FreeBoardCreate;
