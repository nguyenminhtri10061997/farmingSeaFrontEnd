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

  const [createCompany] = useMutation(CREATE_ONE, { fetchPolicy: 'no-cache' })
  const [updateCompany] = useMutation(UPDATE_ONE, { fetchPolicy: 'no-cache' })

  const handleOpen = (selectedRow) => {
    if (selectedRow) {
      form.setFieldsValue({
        ...selectedRow
      })
    } else {
      form.resetFields()
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
        if (res.errors.message.includes('code exist')) {
          notification.error({
            message: 'Lỗi Thêm mới',
            description: 'Mã bị trùng',
            placement: 'topLeft',
          })
          form.setFields([{
            name: 'code',
            errors: ['Mã bị trùng xin vui lòng điền mã khác']
          }])
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
      const res = await updateCompany({
        variables: {
          id,
          info: {
            ...fields, oldCode: state.selectedRow?.code
          }
        }
      })
      if (res.errors) {
        if (res.errors.message.includes('!Failed to fetch')) {
          notification.error({
            message: 'Lỗi chỉnh sửa',
            description: 'Sự cố mạng',
            placement: 'topLeft',
          })
          return
        }
        if (res.errors.message.includes('code exist')) {
          notification.error({
            message: 'Lỗi Thêm mới',
            description: 'Mã bị trùng',
            placement: 'topLeft',
          })
          form.setFields([{
            name: 'code',
            errors: ['Mã bị trùng xin vui lòng điền mã khác']
          }])
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
      isVisible: false,
      selectedRow: {}
    })
  }

  return (
    <Modal
      title={state.selectedRow?.name || 'Nhà cung cấp mới'}
      visible={state.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        layout='vertical'
        form={form}
      >
        <Form.Item
          label='Mã nhà cung cấp'
          name='code'
          rules={[patternRule.required('Mã nhà cung cấp là bắt buộc')]}

        >
          <Input placeholder='Nhập mã nhà cung cấp' />
        </Form.Item>
        <Form.Item
          label='Tên nhà cung cấp'
          name='name'
          rules={[patternRule.required('Tên nhà cung cấp là bắt buộc')]}
        >
          <Input placeholder='Nhập tên nhà cung cấp' />
        </Form.Item>
        <Form.Item
          label='Số điện thoại nhà cung cấp'
          name='mobile'
        >
          <Input placeholder='Nhập số điện thoại nhà cung cấp' />
        </Form.Item>
        <Form.Item
          label='Địa chỉ nhà cung cấp'
          name='address'
        >
          <Input placeholder='Nhập địa chỉ nhà cung cấp' />
        </Form.Item>
      </Form>
    </Modal>
  );
}))