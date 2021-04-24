import React from 'react'
import { TableOutlined, DatabaseOutlined, HomeOutlined, BankOutlined, TeamOutlined, AppstoreOutlined, ReconciliationOutlined, ShopOutlined } from '@ant-design/icons'

export default [
  {
    exact: true,
    path: '/home',
    component: 'home',
    name: 'Trang chủ'
  },
  {
    exact: true,
    path: '/company',
    component: 'company',
    name: 'Công ty'
  },
  {
    exact: true,
    path: '/vendor',
    component: 'vendor',
    name: 'Nhà cung cấp'
  },
  {
    exact: true,
    path: '/customer',
    component: 'customer',
    name: 'Khách hàng'
  },
  {
    exact: true,
    path: '/stockModel',
    component: 'stockModel',
    name: 'Hàng hóa'
  },
  {
    exact: true,
    path: '/import',
    component: 'import',
    name: 'Nhập kho'
  },
  {
    exact: true,
    path: '/stock',
    component: 'stock',
    name: 'Tồn kho',
  },
  {
    exact: true,
    path: '/sale',
    component: 'sale',
    name: 'Bán hàng',
  }
]

export const menus = [
  {
    name: 'Danh mục',
    icon: <DatabaseOutlined />,
    child: [
      {
        exact: true,
        path: '/company',
        component: 'company',
        name: 'Công ty',
        icon: <HomeOutlined />,
      },
      {
        exact: true,
        path: '/vendor',
        component: 'vendor',
        name: 'Nhà cung cấp',
        icon: <BankOutlined />,
      },
      {
        exact: true,
        path: '/customer',
        component: 'customer',
        name: 'Khách hàng',
        icon: <TeamOutlined />,
      },
      {
        exact: true,
        path: '/stockModel',
        component: 'stockModel',
        name: 'Hàng hóa',
        icon: <AppstoreOutlined />,
      },
    ]
  },
  {
    exact: true,
    path: '/import',
    component: 'import',
    name: 'Nhập kho',
    icon: <ReconciliationOutlined />,
  },
  {
    exact: true,
    path: '/stock',
    component: 'stock',
    name: 'Tồn kho',
    icon: <TableOutlined />,
  },
  {
    exact: true,
    path: '/sale',
    component: 'sale',
    name: 'Xuất bán',
    icon: <ShopOutlined />,
  },
]