import * as React from 'react';
import styled from '@emotion/styled';
import { Modal, ModalProps } from 'antd';
import { useRef, useEffect } from 'react';

interface TModalProps extends ModalProps {
  loading?: boolean;
  type?: 'confirm' | 'error' | 'info';
  onOk?: () => void;
  onCancel?: () => void;
}

const JungminModal = (props: TModalProps) => {
  const {
    children,
    className,
    title,
    visible = true,
    loading,
    onOk,
    onCancel,
    closable,
    type = 'primary',
    ...rest
  } = props;

  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <StyledModal
      title={title}
      open={visible}
      centered={true}
      width={320}
      closable={!!closable}
      onOk={onOk}
      onCancel={onCancel}
      transitionName="none"
      maskTransitionName="none"
      cancelButtonProps={type === 'info' ? { style: { display: 'none' } } : {}}
      {...rest}
    >
      {loading && <div>Loading...</div>}
      <p ref={ref} tabIndex={0}>
        {children}
      </p>
    </StyledModal>
  );
};

export default JungminModal;

const StyledModal = styled(Modal)(() => {
  return `
  .ant-modal-footer {
    display: flex;
    justify-content: center;
  }
  `;
});
