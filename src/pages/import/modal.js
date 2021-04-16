import React, { useReducer, forwardRef, useImperativeHandle, useRef, useContext } from 'react'
import { Modal, Form, Steps } from 'antd'
// import { UserOutlined, SolutionOutlined, LoadingOutlined } from '@ant-design/icons'
// import { useMutation } from '@apollo/client'
import { reducer, checkDoubleClickFunc, mutateData } from '../../commons/commonFunc'
import {
  CREATE_ONE,
  // UPDATE_ONE
} from './gql'
import { AppContext } from '../../configs/appContext'
import CreateImport from './step1'
// import { client } from '../../configs/apollo'

const { Step } = Steps

export default React.memo(forwardRef((props, ref) => {
  const [state, setState] = useReducer(reducer, {
    isVisible: false,
    selectedRow: {},
    current: 0
  })
  const appContext = useContext(AppContext)

  const [form] = Form.useForm()

  const refStep1 = useRef()

  const checkDoubleClickRef = useRef()

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
    const fieldsStep1 = refStep1.current.form.getFieldsValue()
    try {
      const res = await mutateData(CREATE_ONE, {
        info: {
          idSrcVendor: fieldsStep1.idSrcVendor,
          idDesCompany: appContext.sourceCompany._id,
          type: 'IMPORT'
        }
      })
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  const update = async (id) => {
    console.log(id)
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

  const renderByStep = (currentStep) => {
    if (currentStep === 0) {
      return (
        <CreateImport
          ref={refStep1}
        />
      )
    }
  }

  return (
    <Modal
      title={state.selectedRow?.name || 'Biên bản nhập kho mới'}
      visible={state.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText='Đóng'
      okText='Bước tiếp theo'
    >
      <div>
        <Steps current={state.current}>
          <Step title='Tạo biên bản nhập' />
          <Step title='Chỉnh sửa nhập hàng' />
          <Step title='Hoàn thành nhập hàng' />
        </Steps>
        {renderByStep(state.current)}
      </div>
    </Modal>
  );
}))