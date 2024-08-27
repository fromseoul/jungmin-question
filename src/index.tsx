import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import koKR from 'antd/es/locale/ko_KR';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={koKR}>
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);
