/* eslint-disable */
import React, { useContext } from 'react'
import { Input, Button, Form, Checkbox } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { AppContext } from '../../configs/appContext'
import './index.scss'
import { patternRule } from '../../commons/commonFunc'
import { useLazyQuery } from '@apollo/client'
import { notification } from 'antd';
import {
  LOGIN
} from './gql'

export default React.memo((props) => {
  const appContext = useContext(AppContext)

  const [form] = Form.useForm()

  const [
    login, 
    { data, error, loading }
  ] = useLazyQuery(LOGIN);

  if (data?.login?.token) {
    const fields = form.getFieldsValue()
    if (fields?.calculate?.remember) {
      localStorage.setItem('usernameInput', fields.username)
      localStorage.setItem('passwordInput', fields.password)
    } else {
      localStorage.removeItem('usernameInput')
      localStorage.removeItem('passwordInput')
    }
    localStorage.setItem('access-token', data.login.token)
    setTimeout(() => {
      appContext.setAuth(true)
      props.history.push('/home')
    })
  }

  const handleClickLogin = async (values) => {
    await login({ variables: { info: { username: values.username, password: values.password }}})
    if (!loading && error) {
      if (error.message.includes('!Failed to fetch')) {
        notification.error({
          message: 'Lỗi đăng nhập',
          description: 'Sự cố mạng',
          placement: 'topLeft',
        })
      }
      if (error.message.includes('!dataUser') || error.message.includes('!password')) {
        notification.error({
          message: 'Lỗi đăng nhập',
          description: 'Sai tài khoản hoặc mật khẩu',
          placement: 'topLeft',
        })
      }
      notification.error({
        message: 'Lỗi đăng nhập',
        description: 'Lỗi đăng nhập',
        placement: 'topLeft',
      })
    }
    if (!data?.login?.token) {
      notification.error({
        message: 'Lỗi đăng nhập',
        description: 'Sai tài khoản hoặc mật khẩu',
        placement: 'topLeft',
      })
    }
  }
  return (
    <div className='loginWrapper'>
      <div className='loginForm'>
        <h1 style={{ textAlign: 'center', color: '#1890ff' }}>Sign in</h1>
        <Form
          form={form}
          onFinish={handleClickLogin}
          initialValues={{
            username: localStorage.getItem('usernameInput'),
            password: localStorage.getItem('passwordInput'),
            calculate: {
              remember: localStorage.getItem('usernameInput') !== null
            }
          }}
        >
          <Form.Item
            name='username'
            rules={[patternRule.required('Tài khoản là bắt buộc')]}
          >
            <Input placeholder='Tài khoản' suffix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[patternRule.required('Mật khẩu là bắt buộc')]}
          >
            <Input.Password style={{ margin: '10px 0' }} placeholder='Mật khẩu' />
          </Form.Item>
          <Form.Item
            name={['calculate', 'remember']}
            valuePropName='checked'
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              style={{ width: 380 }}
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
})