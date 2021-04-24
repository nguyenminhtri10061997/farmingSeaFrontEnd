import React, { useReducer, forwardRef, useImperativeHandle, useRef } from 'react'
import { Modal, notification, Input, Form, Select, InputNumber } from 'antd'
import { useMutation } from '@apollo/client'
import { reducer, patternRule, checkDoubleClickFunc } from '../../commons/commonFunc'
import {
  CREATE_ONE,
  UPDATE_ONE
} from './gql'
import './modal.scss'

const { Option } = Select

export default React.memo(forwardRef((props, ref) => {
  const [state, setState] = useReducer(reducer, {
    isVisible: false,
    selectedRow: {},
    unit: [null]
  })

  const [form] = Form.useForm()

  const checkDoubleClickRef = useRef()

  const [createCompany] = useMutation(CREATE_ONE, { fetchPolicy: 'no-cache' })
  const [updateCompany] = useMutation(UPDATE_ONE, { fetchPolicy: 'no-cache' })

  const handleOpen = (selectedRow) => {
    if (selectedRow) {
      form.setFieldsValue({
        ...selectedRow,
        calculate: {
          selectFactor: selectedRow?.detail?.unit?.length
        }
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        calculate: {
          selectFactor: 1
        },
        detail: {
          costPrice: 0
        }
      })
    }
    setState({
      isVisible: true,
      selectedRow: selectedRow || {},
      unit: selectedRow?.detail?.unit || [null]
    })
  }

  useImperativeHandle(ref, () => ({
    handleOpen
  }))

  const create = async () => {
    const fields = form.getFieldsValue()
    if (fields.detail.factor) {
      fields.detail.factor[0] = 1
    } else {
      fields.detail.factor = [1]
    }
    
    delete fields.calculate
    try {
      const res = await createCompany({
        variables: {
          info: fields
        }
      })
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
    if (fields.detail.factor) {
      fields.detail.factor[0] = 1
    } else {
      fields.detail.factor = [1]
    }
    
    delete fields.calculate
    try {
      const res = await updateCompany({
        variables: {
          id,
          info: {
            ...fields,
            oldCode: state.selectedRow?.code
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
      selectedRow: {},
      unit: [null]
    })
  }

  const handleChangeSelect = (val) => {
    const fields = form.getFieldsValue()
    const newUnit = new Array(val).fill(null)
    const factor = []
    newUnit.forEach((_, idx) => {
      newUnit[idx] = state.unit[idx]
      const valueFactor = fields.factor ? fields.factor[idx] : undefined
      factor.push(valueFactor)
    })
    setState({
      unit: newUnit
    })
    form.setFieldsValue({
      unit: newUnit,
      factor
    })
  }

  const handleChangeUnit = (idx, val) => {
    state.unit[idx] = val
    setState({})
  }

  window.getFieldsValue = form.getFieldsValue

  const renderTableUnitFactor = (unit) => {
    const { length } = unit
    if (length === 1) {
      return (
        <table>
          <tr>
            <td style={{ display: 'none' }}>&nbsp;</td>
            <td>
              <Form.Item
                name={['detail', 'unit', 0]}
                rules={[patternRule.required('Tên Hàng hóa là bắt buộc')]}
              >
                <Input onChange={(e) => handleChangeUnit(0, e.target.value)} style={{ width: 50 }} />
              </Form.Item>
            </td>
          </tr>
        </table>
      )
    }
    else {
      return (
        <table>
          <tbody>
            {
              (new Array((length) - 1).fill(null)).map((_, idx) => {
                if (idx === 0) {
                  return (
                    <tr key={idx}>
                      <td
                        style={{ padding: '0 10px' }}
                      >1</td>
                      <td
                        style={{ padding: '0 10px' }}
                      >
                        <Form.Item
                          name={['detail', 'unit', idx]}
                          rules={[patternRule.required('Đơn vị bắt buộc phải có')]}
                        >
                          <Input onChange={(e) => handleChangeUnit(idx, e.target.value)} style={{ width: 50 }} />
                        </Form.Item>
                      </td>
                      <td
                        style={{ padding: '0 10px' }}
                      >=</td>
                      <td
                        style={{ padding: '0 10px' }}
                      >
                        <Form.Item
                          name={['detail', 'factor', idx + 1]}
                          rules={[patternRule.required('Đơn vị bắt buộc phải có')]}
                        >
                          <InputNumber style={{ width: 50 }} />
                        </Form.Item>
                      </td>
                      <td
                        style={{ padding: '0 10px' }}
                      >
                        <Form.Item
                          name={['detail', 'unit', idx + 1]}
                          rules={[patternRule.required('Đơn vị bắt buộc phải có')]}
                        >
                          <Input onChange={(e) => handleChangeUnit(idx + 1, e.target.value)} style={{ width: 50 }} />
                        </Form.Item>
                      </td>
                    </tr>
                  )
                } else {
                  return (
                    <tr key={idx}>
                      <td style={{ padding: '0 10px' }}>1</td>
                      <td style={{ padding: '0 10px' }}>
                        {state.unit[idx]}
                      </td>
                      <td style={{ padding: '0 10px' }}>=</td>
                      <td style={{ padding: '0 10px' }}>
                        <Form.Item
                          name={['detail', 'factor', idx + 1]}
                          rules={[patternRule.required('Đơn vị bắt buộc phải có')]}
                        >
                          <InputNumber style={{ width: 50 }} />
                        </Form.Item>
                      </td>
                      <td style={{ padding: '0 10px' }}>
                        <Form.Item
                          name={['detail', 'unit', idx + 1]}
                          rules={[patternRule.required('Đơn vị bắt buộc phải có')]}
                        >
                          <Input onChange={(e) => handleChangeUnit(idx + 1, e.target.value)} style={{ width: 50 }} />
                        </Form.Item>
                      </td>
                    </tr>
                  )
                }
              })
            }
          </tbody>
        </table>
      )
    }
  }

  return (
    <Modal
      title={state.selectedRow?.name || 'Hàng hóa mới'}
      visible={state.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className='modalStockModel'
    >
      <Form
        layout='vertical'
        form={form}
      >
        <Form.Item
          label='Mã hàng hóa'
          name='code'
          rules={[patternRule.required('Mã hàng hóa là bắt buộc')]}

        >
          <Input placeholder='Nhập mã Hàng hóa' />
        </Form.Item>
        <Form.Item
          label='Tên hàng hóa'
          name='name'
          rules={[patternRule.required('Tên Hàng hóa là bắt buộc')]}
        >
          <Input placeholder='Nhập tên hàng hóa' />
        </Form.Item>
        <Form.Item
          label='Giá vốn'
          name={['detail', 'costPrice']}
          rules={[patternRule.required('giá vốn là bắt buộc')]}
        >
          <InputNumber style={{ width: '100%' }} min={0} placeholder='Nhập giá vốn' />
        </Form.Item>
        <Form.Item
          label='quy cách'
          name={['calculate', 'selectFactor']}
        >
          <Select onChange={handleChangeSelect}>
            <Option value={1}>1 đơn vị</Option>
            <Option value={2}>2 đơn vị</Option>
            <Option value={3}>3 đơn vị</Option>
            <Option value={4}>4 đơn vị</Option>
            <Option value={5}>5 đơn vị</Option>
            <Option value={6}>6 đơn vị</Option>
            <Option value={7}>7 đơn vị</Option>
          </Select>
        </Form.Item>
        {renderTableUnitFactor(state.unit)}
      </Form>
    </Modal>
  );
}))