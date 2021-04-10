import React, { useReducer, forwardRef, useImperativeHandle, useRef } from 'react'
import { Modal, notification, Input, Form } from 'antd'
import { useMutation } from '@apollo/client'
import { reducer, patternRule, checkDoubleClickFunc } from '../../commons/commonFunc'
import {
  CREATE_ONE,
  UPDATE_ONE
} from './gql'

export default React.memo(forwardRef((props, ref) => {
  const [state, setState] = useReducer(reducer, {
    isVisible: false,
    selectedRow: {}
  })

  const [form] = Form.useForm()

  const checkDoubleClickRef = useRef()

  const [createCompany] = useMutation(CREATE_ONE)
  const [updateCompany] = useMutation(UPDATE_ONE)

  const handleOpen = (selectedRow) => {
    if (selectedRow) {
      form.setFieldsValue({
        ...selectedRow
      })
    }
    setState({
      isVisible: true,
      selectedRow: selectedRow || {}
    })
  }

  useImperativeHandle(ref, () => ({
    handleOpen
  }))

  const create = async () => {
    const fields = form.getFieldsValue()
    try {
      const res = await createCompany({ variables: { info: fields } })
      if (res.errors) {
        if (res.errors.message.includes('!Failed to fetch')) {
          notification.error({
            message: 'Lỗi Thêm mới',
            description: 'Sự cố mạng',
            placement: 'topLeft',
          })
          return
        }
        notification.error({
          message: 'Lỗi thêm mới',
          description: 'Có lỗi khi thêm mới',
          placement: 'topLeft',
        })
        return
      }
      
      notification.success({
        message: 'Thêm mới',
        description: 'Thêm mới thành công',
        placement: 'bottomLeft',
      })
      props.refetch()
      setState({
        isVisible: false,
        selectedRow: {}
      })
    } catch (err) {
      console.log(err)
    }
  }

  const update = async (id) => {
    const fields = form.getFieldsValue()
    try {
      const res = await updateCompany({ variables: { id, info: fields } })
      if (res.errors) {
        if (res.errors.message.includes('!Failed to fetch')) {
          notification.error({
            message: 'Lỗi chỉnh sửa',
            description: 'Sự cố mạng',
            placement: 'topLeft',
          })
          return
        }
        notification.error({
          message: 'Lỗi chỉnh sửa',
          description: 'Có lỗi khi Chỉnh sửa',
          placement: 'topLeft',
        })
        return
      }
      
      notification.success({
        message: 'Chỉnh sửa',
        description: 'Chỉnh sửa thành công',
        placement: 'bottomLeft',
      })
      props.refetch()
      setState({
        isVisible: false,
        selectedRow: {}
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleOk = async () => {
    await form.validateFields().then(() => {
      if (state.selectedRow?._id) {
        checkDoubleClickFunc(checkDoubleClickRef, update, [state.selectedRow._id])
      } else {
        checkDoubleClickFunc(checkDoubleClickRef, create)
      }
    })
  }

  const handleCancel = () => {
    setState({
      isVisible: false
    })
  }

  return (
    <Modal
      title={state.selectedRow?.name || 'Công ty mới'}
      visible={state.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        layout='vertical'
        form={form}
        initialValues={{
          username: localStorage.getItem('usernameInput'),
          password: localStorage.getItem('passwordInput'),
          calculate: {
            remember: localStorage.getItem('usernameInput') !== null
          }
        }}
      >
        <Form.Item
          label='Mã công ty'
          name='code'
          rules={[patternRule.required('Mã công ty là bắt buộc')]}

        >
          <Input placeholder='Nhập mã công ty' />
        </Form.Item>
        <Form.Item
          label='Tên công ty'
          name='name'
          rules={[patternRule.required('Tên công ty là bắt buộc')]}
        >
          <Input placeholder='Nhập tên công ty' />
        </Form.Item>
        <Form.Item
          label='Số điện thoại công ty'
          name='mobile'
        >
          <Input placeholder='Nhập số điện thoại công ty' />
        </Form.Item>
        <Form.Item
          label='Địa chỉ công ty'
          name='address'
        >
          <Input placeholder='Nhập địa chỉ công ty' />
        </Form.Item>
      </Form>
    </Modal>
  );
}))