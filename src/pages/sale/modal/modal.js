import React, { useReducer, forwardRef, useImperativeHandle, useRef, useContext } from 'react'
import { Modal, Steps, notification, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
// import { useMutation } from '@apollo/client'
import { reducer, checkDoubleClickFunc, mutateData, queryData } from '../../../commons/commonFunc'
import {
  CREATE_ONE,
  GET_ONE,
  CANCEL_DOCUMENT,
  VERIFY_DOCUMENT,
  CANCEL_COMPLETED_DOCUMENT
} from '../gql'
import { AppContext } from '../../../configs/appContext'
import CreateImport from './step1'
import CreateTTran from './step2'
import PrintSaleDocument from '../../prints/printSaleDocument'

const { Step } = Steps
const { confirm } = Modal

export default React.memo(forwardRef((props, ref) => {
  const [state, setState] = useReducer(reducer, {
    isVisible: false,
    selectedRow: {},
    current: 0
  })
  const appContext = useContext(AppContext)

  const refStep1 = useRef()
  const refStep2 = useRef()


  const checkDoubleClickRef = useRef()

  const handleOpen = (selectedRow) => {
    const objSetState = {
      isVisible: true,
      selectedRow: selectedRow || {}
    }
    if (selectedRow) {
      objSetState.currentStep = selectedRow.state === 'RECEIVED' ? 1 : 2
    } else {
      objSetState.currentStep = 0
    }
    setState(objSetState)
  }

  const refreshSelectedRow = async () => {
    if (state.selectedRow?._id) {
      const resGetOne = await queryData(GET_ONE, {
        id: state.selectedRow._id
      })
      handleOpen(resGetOne.data?.document)
    }
  }

  useImperativeHandle(ref, () => ({
    handleOpen
  }))

  const create = async () => {
    const fieldsStep1 = refStep1.current.form.getFieldsValue()
    const res = await mutateData(CREATE_ONE, {
      info: {
        idDesCustomer: fieldsStep1.idDesCustomer,
        idSrcCompany: appContext.sourceCompany._id,
        type: 'SALE'
      }
    })
    if (res.errors) {
      if (res.errors.message.includes('!Failed to fetch')) {
        notification.error({
          message: 'Lỗi tạo mới',
          description: 'Sự cố mạng',
          placement: 'topLeft',
        })
        return
      }
      notification.error({
        message: 'Lỗi tạo mới',
        description: 'Có lỗi khi tạo mới',
        placement: 'topLeft',
      })
      return
    }
    notification.success({
      message: 'Tạo mới',
      description: 'Tạo mới thành công',
      placement: 'bottomLeft',
    })
    handleOpen(res.data.createDocumentSale)
    props.refetch()
  }

  const complete = async () => {
    const res = await mutateData(VERIFY_DOCUMENT, {
      id: state.selectedRow._id
    })
    if (res.errors) {
      if (res.errors.message.includes('!Failed to fetch')) {
        notification.error({
          message: 'Lỗi duyệt',
          description: 'Sự cố mạng',
          placement: 'topLeft',
        })
        return
      }
      if (res.errors.message.includes('document.state !== EnumStateDocument.RECEIVED')) {
        notification.error({
          message: 'Lỗi duyệt',
          description: 'Trạng thái của phiếu đã thay đổi vui lòng chọn lại phiếu',
          placement: 'topLeft',
        })
        return
      }
      if (res.errors.message.includes('count stock')) {
        notification.error({
          message: 'Lỗi duyệt',
          description: 'Có hàng tồn không đủ',
          placement: 'topLeft',
        })
        return
      }
      notification.error({
        message: 'Lỗi duyệt',
        description: 'Có lỗi khi duyệt',
        placement: 'topLeft',
      })
      return
    }
    notification.success({
      message: 'Duyệt',
      description: 'Duyệt thành công',
      placement: 'bottomLeft',
    })
    refreshSelectedRow()
    props.refetch()
  }

  const handleOk = () => {
    if (state.selectedRow?._id) {
      confirm({
        title: 'Xác nhận duyệt',
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc muốn duyệt hoàn thành phiếu bán hàng',
        onOk: () => {
          return new Promise((resolve) => {
          checkDoubleClickFunc(checkDoubleClickRef, complete).then(() => {
              resolve()
            })
          }).catch((err) => console.log(err))
        },
        onCancel() {},
      });
    } else {
      checkDoubleClickFunc(checkDoubleClickRef, create)
    }
  }

  const handleCancel = () => {
    refStep1.current?.form?.resetFields()
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
          selectedRow={state.selectedRow}
        />
      )
    } else if (currentStep === 1) {
      return (
        <CreateTTran
          ref={refStep2}
          selectedRow={state.selectedRow}
          refreshSelectedRow={refreshSelectedRow}
        />
      )
    }
    return (
      <CreateTTran
        ref={refStep2}
        selectedRow={state.selectedRow}
      />
    )
  }

  const handleClickPrint = () => {
    PrintSaleDocument(state.selectedRow._id, appContext.sourceCompany._id, appContext.currentUser)
  }

  const cancel = async () => {
    const res = await mutateData(CANCEL_DOCUMENT, {
      id: state.selectedRow._id
    })
    if (res.errors) {
      if (res.errors.message.includes('!Failed to fetch')) {
        notification.error({
          message: 'Lỗi hủy',
          description: 'Sự cố mạng',
          placement: 'topLeft',
        })
        return
      }
      if (res.errors.message.includes('document.state !== EnumStateDocument.RECEIVED')) {
        notification.error({
          message: 'Lỗi hủy',
          description: 'Trạng thái của phiếu đã thay đổi vui lòng chọn lại phiếu',
          placement: 'topLeft',
        })
        return
      }
      notification.error({
        message: 'Lỗi hủy',
        description: 'Có lỗi khi hủy',
        placement: 'topLeft',
      })
      return
    }
    notification.success({
      message: 'Hủy',
      description: 'Hủy thành công',
      placement: 'bottomLeft',
    })
    handleCancel()
    props.refetch()
  }
  const cancelComplete = async () => {
    const res = await mutateData(CANCEL_COMPLETED_DOCUMENT, {
      id: state.selectedRow._id
    })
    if (res.errors) {
      if (res.errors.message.includes('!Failed to fetch')) {
        notification.error({
          message: 'Lỗi hủy',
          description: 'Sự cố mạng',
          placement: 'topLeft',
        })
        return
      }
      if (res.errors.message.includes('document.state !== EnumStateDocument.COMPLETED')) {
        notification.error({
          message: 'Lỗi hủy',
          description: 'Trạng thái của phiếu đã thay đổi vui lòng chọn lại phiếu',
          placement: 'topLeft',
        })
        return
      }
      notification.error({
        message: 'Lỗi hủy',
        description: 'Có lỗi khi hủy',
        placement: 'topLeft',
      })
      return
    }
    notification.success({
      message: 'Hủy',
      description: 'Hủy thành công',
      placement: 'bottomLeft',
    })
    refreshSelectedRow()
    props.refetch()
  }

  const handleClickCancel = () => {
    confirm({
      title: 'Xác nhận hủy',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc muốn hủy ${state.selectedRow.state === 'COMPLETED' ? 'hoàn thành' : 'phiếu'} bán hàng`,
      onOk: () => {
        return new Promise((resolve) => {
          if (state.selectedRow.state === 'COMPLETED') {
            cancelComplete().then(() => {
              resolve()
            })
          } else {
            cancel().then(() => {
              resolve()
            })
          }
        }).catch((err) => console.log(err))
      },
      onCancel() {},
    });
  }

  const arrFooter = () => {
    const arr = [
      <Button key='close' onClick={handleCancel}>
        Đóng
      </Button>,
    ]
    if (state.selectedRow?._id) {
      arr.splice(1, 0, (
        <Button key='print' type='primary' onClick={handleClickPrint}>
          In phiếu
        </Button>
      ))
      if (state.selectedRow.state !== 'COMPLETED') {
        arr.push((
          <Button key='submit' type='primary' onClick={handleOk}>
            {!state.selectedRow?._id ? 'Bước tiếp theo' : 'Hoàn thành'}
          </Button>
        ))
      }
      arr.splice(1, 0, (
        <Button key='cancel' onClick={handleClickCancel} danger>
          Hủy {state.selectedRow.state === 'COMPLETED' ? 'hoàn thành' : 'phiếu'} bán hàng
        </Button>
      ))
    } else {
      arr.splice(1, 0, (
        <Button key='submit' type='primary' onClick={handleOk}>
          {!state.selectedRow?._id ? 'Bước tiếp theo' : 'Hoàn thành'}
        </Button>
      ))
    }
    return arr
  }

  return (
    <Modal
      title={state.selectedRow?.code || 'Biên bản bán hàng kho mới'}
      visible={state.isVisible}
      onCancel={handleCancel}
      cancelText='Đóng'
      footer={arrFooter()}
      width='90vw'
    >
      <div
        style={{
          padding: 10,
          paddingTop: 0
        }}
      >
        <Steps current={state.currentStep}>
          <Step title='Tạo biên bản bán hàng' />
          <Step title='Chỉnh sửa bán hàng' />
          <Step status={state.selectedRow?.state === 'COMPLETED' ? 'finish' : undefined} title='Hoàn thành bán hàng' />
        </Steps>
        {renderByStep(state.currentStep)}
      </div>
    </Modal>
  );
}))