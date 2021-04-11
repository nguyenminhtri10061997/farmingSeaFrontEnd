import React, { useReducer, useContext, useEffect } from 'react'
import { Layout, Menu, Breadcrumb, Avatar, Row, Col, Dropdown, Select } from 'antd'
import { PieChartOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { reducer } from '../../commons/commonFunc'
import { AppContext } from '../../configs/appContext'
// import logoConTom from '../../commons/images/logo-con-tom.jpg'
import './index.scss'
import listRouter from '../../configs/router'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

const { Header, Content, Footer, Sider } = Layout
const { Option } = Select

const objPathToNameBreacum = {}
listRouter.forEach(route => {
  objPathToNameBreacum[route.path] = route.name
})
export default React.memo((props) => {
  const appContext = useContext(AppContext)

  const [state, setState] = useReducer(reducer, {
    collapsed: true,
    menuCurrentKeyActive: 'home'
  })

  const handleOnCollapse = (collapsed) => {
    setState({
      collapsed,
    })
  }

  const handleClickLogOut = () => {
    appContext.setAuth(false)
    props.history.push('/login')
    localStorage.removeItem('access-token')
  } 

  const handleClickLogo = () => {
    props.history.push('/home')
    setState({
      menuCurrentKeyActive: 'home'
    })
  }

  const handleSelectMenu = (e) => {
    setState({
      menuCurrentKeyActive: e.key
    })
  }

  useEffect(() => {
    setState({
      menuCurrentKeyActive: props.location.pathname.substr(1)
    })
  }, [props.location.pathname])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={state.collapsed} onCollapse={handleOnCollapse}>
        <div style={ state.collapsed ? { backgroundPosition: '-10px 0px' } : { backgroundPosition: '-0px -20px' }} className='logo' onClick={handleClickLogo} />
        <Menu onSelect={handleSelectMenu} selectedKeys={[state.menuCurrentKeyActive]} theme='dark' defaultSelectedKeys={['1']} mode='inline'>
          {listRouter.map(route => (
            <Menu.Item key={route.component} icon={<PieChartOutlined />}>
              <Link to={route.path}>{route.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header className='site-layout-background' style={{ padding: 0 }}>
          <Row>
            <Col flex='auto'>
              <h3
                style={{
                  color: 'white',
                  margin: '0 1rem'
                }}
              >
                HỆ THỐNG QUẢN LÝ HÀNG THỦY SẢN
              </h3>
            </Col>
            <Col flex='279px'>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 64,
                  justifyContent: 'flex-end'
                }}
              >
                <Select defaultValue='default' style={{ width: 200 }}>
                  {appContext?.sourceCompany?._id && (
                    <Option value={appContext.sourceCompany._id}>{appContext.sourceCompany.name}</Option>
                  )}
                </Select>
                <Dropdown
                  overlay={(
                    <Menu onClick={handleClickLogOut}>
                      <Menu.Item>
                        <Link to='/logout'>Đăng xuất</Link>
                      </Menu.Item>
                    </Menu>
                  )}
                  placement='bottomCenter'
                  arrow
                  trigger={['click']}
                >
                  <Avatar
                    style={{ backgroundColor: 'rgb(24, 144, 255)', margin: '0 16px' }}
                    icon={<UserOutlined />}
                  />
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0', fontSize: 'large', fontWeight: 'bold' }}>
            <Breadcrumb.Item>{objPathToNameBreacum[props.location.pathname]}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className='layout-content'
          >
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  )
})
