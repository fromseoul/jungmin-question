import React from 'react';
import { useBoardsQuery } from './hooks/useBoardsQuery';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

function SummaryBoard() {
  const { data, isLoading } = useBoardsQuery({ per_page: '5', page: '1' });

  return (
    <StyledTable>
      {data.map((board: any, index: any) => {
        const createdAt = dayjs(board.created_at);
        const isToday = createdAt.isSame(dayjs(), 'day');

        return (
          <p key={index}>
            <span>{board.title}</span>
            <span>{isToday ? dayjs(createdAt).format('hh:mm') : dayjs(createdAt).format('MM/DD hh:mm')}</span>
          </p>
        );
      })}
    </StyledTable>
  );
}

export default SummaryBoard;

const StyledTable = styled.table`
  width: 100%;
  p {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    span:nth-of-type(1) {
      width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
