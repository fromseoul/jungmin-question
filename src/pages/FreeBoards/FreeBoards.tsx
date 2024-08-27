import React, { useState } from 'react';
import { Avatar, Button, Image, Input, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useBoardsQuery } from './hooks/useBoardsQuery';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBoardSearchQuery } from './hooks/useBoardSearchQuery';
import JungminModal from '../../components/JungminModal';

const { Search } = Input;

function App() {
  let [params, setParams] = useSearchParams();
  const perPage = params.get('per_page');
  const page = params.get('page');
  const searchType = params.get('search_type');
  const keyword = params.get('keyword');

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState('title');

  const [search, setSearch] = useState('');
  const [searchModal, setSearchModal] = useState(false);
  const [searchCancelButton, setSearchCancelButton] = useState(false);

  const {
    data: boardsData,
    isLoading: boardLoading,
    lastPage: boardLastPage,
  } = useBoardsQuery({ per_page: perPage!, page: page! });
  const {
    data: searchData,
    isLoading: searchLoading,
    lastPage: searchLastPage,
  } = useBoardSearchQuery({
    type: searchType!,
    keyword: keyword!,
    per_page: perPage!,
    page: page!,
  });

  const onTitleClick = (url: string) => () => {
    const id = url.split('/').pop();
    navigate(`${id}`);
  };

  const searchColumn: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'index',
      width: 100,
      defaultSortOrder: 'descend',
    },
    {
      title: '제목',
      dataIndex: 'display_name',
      width: 500,
    },
    {
      title: '작성일',
      dataIndex: 'created_at',
      render: (created_at: string) => dayjs(created_at).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'number',
      width: 100,
      defaultSortOrder: 'descend',
    },
    {
      title: '제목',
      dataIndex: 'title',
      width: 200,
      render: (title: string, record: any) => (
        <Button type="link" onClick={onTitleClick(record.url)} style={{ width: 400 }}>
          <p style={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>{title}</p>
        </Button>
      ),
    },
    {
      title: '작성자',
      dataIndex: 'user',
      render: (user: any) => (
        <>
          <Avatar style={{ marginRight: '8px' }} icon={<Image src={user.avatar_url} />} />
          <span>{user.login}</span>
        </>
      ),
    },
    {
      title: '작성일',
      dataIndex: 'created_at',
      render: (created_at: string) => dayjs(created_at).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const onSearchKeywordChange = (e: any) => {
    setSearch(e.target.value);
    if (e.target.value) {
      setSearchCancelButton(true);
    } else {
      setSearchCancelButton(false);
    }
  };

  const onSearch = (value: string) => {
    if (!value) {
      setSearchModal(true);
      return;
    }
    setParams({ search_type: searchParams, keyword: value });
  };

  const cancelSearch = () => {
    setSearch('');
    setSearchCancelButton(false);
  };

  const onCreate = () => {
    navigate('create');
  };

  if (boardLoading || searchLoading) {
    return <div>loading...</div>;
  }

  return (
    <>
      <StyledSpace>
        <Space>
          <Select
            defaultValue={searchParams}
            value={searchParams}
            style={{ width: 100 }}
            options={[
              { value: 'title', label: '제목' },
              { value: 'content', label: '내용' },
            ]}
            onChange={value => setSearchParams(value)}
          />
          <Search
            onSearch={onSearch}
            onChange={onSearchKeywordChange}
            value={search}
            enterButton={<>검색</>}
            style={{ width: 200 }}
            autoComplete="off"
          />
          {searchCancelButton && <Button onClick={cancelSearch}>검색 취소</Button>}
        </Space>
        <Button onClick={onCreate} icon={<PlusOutlined />}>
          글쓰기
        </Button>
      </StyledSpace>
      {!searchData ? (
        <Table
          dataSource={boardsData}
          columns={columns}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: page ? parseInt(page) : 1,
            total: boardLastPage ? parseInt(boardLastPage) * (perPage ? parseInt(perPage) : 10) : 0,
            pageSize: perPage ? parseInt(perPage) : 10,
            onChange: page => setParams({ per_page: perPage ? perPage : '10', page: page.toString() }),
          }}
        />
      ) : (
        <Table
          dataSource={searchData}
          columns={searchColumn}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: page ? parseInt(page) : 1,
            total: searchLastPage ? parseInt(searchLastPage) * (perPage ? parseInt(perPage) : 10) : 0,
            pageSize: perPage ? parseInt(perPage) : 10,
            onChange: page => setParams({ per_page: perPage ? perPage : '10', page: page.toString() }),
          }}
        />
      )}
      {searchModal && (
        <JungminModal open={searchModal} type="info" okText="확인" onOk={() => setSearchModal(false)}>
          검색어를 입력하세요.
        </JungminModal>
      )}
    </>
  );
}

export default App;

const StyledSpace = styled(Space)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
`;
