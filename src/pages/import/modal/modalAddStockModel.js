import React, { useReducer, forwardRef, useImperativeHandle, useRef } from 'react'
import { Modal, Form, Select, InputNumber, notification } from 'antd'
import { reducer, patternRule, queryData, checkDoubleClickFunc, mutateData } from '../../../commons/commonFunc'
import { SEARCH_STOCKMODELS, CREATE_STRANSACTION, UPDATE_STRANSACTIONS } from '../gql'
import './modalAddStockModel.scss'

const { Option } = Select

export default React.memo(forwardRef((props, ref) => {
  const [state, setState] = useReducer(reducer, {
    isVisible: false,
    selectedRow: {},
    optsStockModel: [],
    selectedStockModel: {}
  })

  const [form] = Form.useForm()

  const waiting = useRef()
  const checkDoubleClickRef = useRef()

  const searchStockModels = async (searchString = '', idDefault) => {
    const {
      data: {
        searchStockModels
      }
    } = await queryData(SEARCH_STOCKMODELS, {
      searchString,
      idDefault,
      limit: 30,
    })
    return searchStockModels || []
  }

  const handleOpen = async (selectedRow) => {
    form.resetFields()
    const objSetState = {
      isVisible: true,
      selectedRow: selectedRow || {}
    }
    if (selectedRow) {
      if (!state.optsStockModel?.length || !state.optsStockModel.find(i => i._id === selectedRow.idStockModel)) {
        objSetState.optsStockModel = await searchStockModels('', selectedRow.idStockModel)
      }
      form.setFieldsValue({
        idStockModel: selectedRow.idStockModel,
        quantity: selectedRow.quantity,
        buyPrice: selectedRow.buyPrice
      })
      objSetState.selectedStockModel = (objSetState.optsStockModel || state.optsStockModel).find(i => i._id === selectedRow.idStockModel)
    }
    if (!state.optsStockModel?.length && !objSetState.optsStockModel?.length) {
      objSetState.optsStockModel = await searchStockModels()
    }
    setState(objSetState)
  }

  useImperativeHandle(ref, () => ({
    handleOpen
  }))

  const handleCancel = () => {
    setState({
      isVisible: false,
      selectedRow: {},
      selectedStockModel: {}
    })
  }
  
  const handleSearchStockModel = (val, wait) => {
    if (waiting.current) clearTimeout(waiting.current)
    waiting.current = setTimeout(async () => {
      let optsStockModel = await searchStockModels(val)
      setState({
        optsStockModel
      })
    }, wait || 300)
  }

  const handleChangeStockModel = (id) => {
    const stockModelFinded = state.optsStockModel.find(i => i._id === id)
    if (stockModelFinded) {
      form.setFieldsValue({
        quantity: new Array(stockModelFinded.detail?.unit?.length).fill(0),
        buyPrice: new Array(stockModelFinded.detail?.unit?.length).fill(0)
      })
    }
    setState({
      selectedStockModel: stockModelFinded
    })
  }

  const createSTransaction = async () => {
    const fields = form.getFieldsValue()
    const res = await mutateData(CREATE_STRANSACTION, {
      info: {
        idStockModel: fields.idStockModel,
        idDocument: props.selectedRow?._id,
        quantity: fields.quantity,
        buyPrice: fields.buyPrice
      }
    })
    if (res.errors) {
      if (res.errors.message.includes('!Failed to fetch')) {
        notification.error({
          message: 'L???i xo??a',
          description: 'S??? c??? m???ng',
          placement: 'topLeft',
        })
        return
      }
      notification.error({
        message: 'L???i t???o m???i',
        description: 'C?? l???i khi t???o m???i',
        placement: 'topLeft',
      })
      return
    }
    notification.success({
      message: 'T???o m???i',
      description: 'T???o m???i th??nh c??ng',
      placement: 'bottomLeft',
    })
    handleCancel()
    props.refreshSelectedRow()
  }

  const updateSTransaction = async () => {
    const fields = form.getFieldsValue()
    const res = await mutateData(UPDATE_STRANSACTIONS, {
      id: state.selectedRow._id,
      info: {
        quantity: fields.quantity,
        buyPrice: fields.buyPrice
      }
    })
    if (res.errors) {
      if (res.errors.message.includes('!Failed to fetch')) {
        notification.error({
          message: 'L???i xo??a',
          description: 'S??? c??? m???ng',
          placement: 'topLeft',
        })
        return
      }
      notification.error({
        message: 'L???i t???o m???i',
        description: 'C?? l???i khi t???o m???i',
        placement: 'topLeft',
      })
      return
    }
    notification.success({
      message: 'T???o m???i',
      description: 'T???o m???i th??nh c??ng',
      placement: 'bottomLeft',
    })
    handleCancel()
    props.refreshSelectedRow()
  }

  const handleOk = () => {
    form.validateFields().then((value) => {
      if (value.quantity.every(i => i <= 0)) {
        notification.error({
          message: 'L???i l??u',
          description: 'Ph???i nh???p ??t nh???t s??? l?????ng/1 ????n v???',
          placement: 'topLeft',
        })
        return
      }
      let flag
      value.quantity.forEach((quan, idx) => {
        if (quan && !value.buyPrice[idx]) {
          flag = true
        }
      })
      if (flag) {
        notification.error({
          message: 'L???i l??u',
          description: '????n v??? c?? SL nh???p ph???i c?? gi?? t????ng ???ng',
          placement: 'topLeft',
        })
        return
      }
      if (state.selectedRow?._id) {
        checkDoubleClickFunc(checkDoubleClickRef, updateSTransaction)
      } else {
        if (props.selectedRow?.sTransactions?.map(i => i.idStockModel).includes(value.idStockModel)) {
          notification.error({
            message: 'L???i l??u',
            description: '???? c?? h??ng n??y trong bi??n b???n',
            placement: 'topLeft',
          })
          return
        }
        checkDoubleClickFunc(checkDoubleClickRef, createSTransaction)
      }
    })
  }

  const renderFactor = () => {
    if (state.selectedStockModel?._id) {
      const length = state.selectedStockModel?.detail?.factor?.length
      if (length === 1) {
        return `1 ${state.selectedStockModel.detail.unit[0]}`
      } else {
        return state.selectedStockModel.detail?.factor?.reduce((t, fac, idx) => {
          if (idx === length - 1) {
            return t
          } else {
            return `${t}, 1 ${state.selectedStockModel.detail?.unit[idx]} = ${state.selectedStockModel.detail?.factor[idx + 1]} ${state.selectedStockModel.detail?.unit[idx + 1]}`
          }
        }, '').substr(2)
      }
    }
    return ''
  }
  return (
    <Modal
      title={state.selectedStockModel?.name || 'Th??m h??ng m???i'}
      visible={state.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText='??o??ng'
      okText='L??u'
      className='modalAddStockModel'
    >
      <div>
        <Form
          layout='vertical'
          form={form}
        >
          <Form.Item
            label='T??n h??ng'
            name='idStockModel'
            rules={[patternRule.required('T??n h??ng l?? b???t bu???c')]}

          >
            <Select
              placeholder='Cho??n h??ng'
              onSearch={handleSearchStockModel}
              showSearch
              filterOption={false}
              onChange={handleChangeStockModel}
              disabled={state.selectedRow?._id}
            >
              {state.optsStockModel?.map((item, i) => <Option key={`optsStock-${i}`} value={item._id}>{item.name}</Option>)}
            </Select>
          </Form.Item>
          <div>
            <div>
              {renderFactor()}
            </div>
            {
              state.selectedStockModel?._id && (
                <table>
                  <tbody>
                    <tr>
                      <td>&nbsp;</td>
                      <td><b>SL</b></td>
                      <td><b>????n gi?? nh???p</b></td>
                    </tr>
                    {
                      state.selectedStockModel.detail?.unit?.map((nameUnit, idx) => (
                        <tr key={`nameUnit_${idx}`}>
                          <td style={{ width: '30%' }}><b>{nameUnit}</b></td>
                          <td style={{ padding: '2px 10px' }}>
                            <Form.Item
                              name={['quantity', idx]}
                            >
                              <InputNumber
                                min={0}
                              />
                            </Form.Item>
                          </td>
                          <td style={{ padding: '2px 10px' }}>
                            <Form.Item
                              name={['buyPrice', idx]}
                            >
                              <InputNumber
                                min={0}
                              />
                            </Form.Item>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )
            }
          </div>
        </Form>
      </div>
    </Modal>
  );
}))