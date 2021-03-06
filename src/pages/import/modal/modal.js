import React, { useReducer, forwardRef, useImperativeHandle, useRef, useContext } from 'react'
import { Modal, Steps, notification, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
// import { useMutation } from '@apollo/client'
import { reducer, checkDoubleClickFunc, mutateData, queryData } from '../../../commons/commonFunc'
import {
  CREATE_ONE,
  GET_ONE,
  CANCEL_DOCUMENT,
  VERIFY_DOCUMENT
} from '../gql'
import { AppContext } from '../../../configs/appContext'
import CreateImport from './step1'
import CreateTTran from './step2'
import PrintDocumentImport from '../../prints/printImportDocument'

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
    console.log(fieldsStep1)
    const res = await mutateData(CREATE_ONE, {
      info: {
        idSrcVendor: fieldsStep1.idSrcVendor,
        idDesCompany: appContext.sourceCompany._id,
        type: 'IMPORT'
      }
    })
    if (res.errors) {
      if (res.errors.message.includes('!Failed to fetch')) {
        notification.error({
          message: 'L???i t???o m???i',
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
    handleOpen(res.data.createDocument)
    props.refetch()
  }

  const complete = async () => {
    const res = await mutateData(VERIFY_DOCUMENT, {
      id: state.selectedRow._id
    })
    if (res.errors) {
      if (res.errors.message.includes('!Failed to fetch')) {
        notification.error({
          message: 'L???i duy???t',
          description: 'S??? c??? m???ng',
          placement: 'topLeft',
        })
        return
      }
      if (res.errors.message.includes('document.state !== EnumStateDocument.RECEIVED')) {
        notification.error({
          message: 'L???i duy???t',
          description: 'Tr???ng th??i c???a phi???u ???? thay ?????i vui l??ng ch???n l???i phi???u',
          placement: 'topLeft',
        })
        return
      }
      notification.error({
        message: 'L???i duy???t',
        description: 'C?? l???i khi duy???t',
        placement: 'topLeft',
      })
      return
    }
    notification.success({
      message: 'Duy???t',
      description: 'Duy???t th??nh c??ng',
      placement: 'bottomLeft',
    })
    refreshSelectedRow()
    props.refetch()
  }

  const handleOk = () => {
    if (state.selectedRow?._id) {
      confirm({
        title: 'Xa??c nh????n duy???t',
        icon: <ExclamationCircleOutlined />,
        content: 'Ba??n co?? ch????c mu????n duy???t ho??n th??nh phi???u nh???p',
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
    PrintDocumentImport(state.selectedRow._id, appContext.sourceCompany._id, appContext.currentUser)
  }

  const cancel = async () => {
    const res = await mutateData(CANCEL_DOCUMENT, {
      id: state.selectedRow._id
    })
    if (res.errors) {
      if (res.errors.message.includes('!Failed to fetch')) {
        notification.error({
          message: 'L???i h???y',
          description: 'S??? c??? m???ng',
          placement: 'topLeft',
        })
        return
      }
      if (res.errors.message.includes('document.state !== EnumStateDocument.RECEIVED')) {
        notification.error({
          message: 'L???i h???y',
          description: 'Tr???ng th??i c???a phi???u ???? thay ?????i vui l??ng ch???n l???i phi???u',
          placement: 'topLeft',
        })
        return
      }
      notification.error({
        message: 'L???i h???y',
        description: 'C?? l???i khi h???y',
        placement: 'topLeft',
      })
      return
    }
    notification.success({
      message: 'H???y',
      description: 'H???y th??nh c??ng',
      placement: 'bottomLeft',
    })
    handleCancel()
    props.refetch()
  }

  const handleClickCancel = () => {
    confirm({
      title: 'Xa??c nh????n h???y',
      icon: <ExclamationCircleOutlined />,
      content: 'Ba??n co?? ch????c mu????n h???y phi???u nh???p',
      onOk: () => {
        return new Promise((resolve) => {
          cancel().then(() => {
            resolve()
          })
        }).catch((err) => console.log(err))
      },
      onCancel() {},
    });
  }

  const arrFooter = () => {
    if (state.selectedRow?._id) {
      if (state.selectedRow.state !== 'COMPLETED') {
        return [
          <Button key='close' onClick={handleCancel}>
            ??o??ng
          </Button>,
          <Button key='print' type='primary' onClick={handleClickPrint}>
            In phi???u
          </Button>,
          <Button key='cancel' onClick={handleClickCancel} danger>
            H???y phi???u nh???p
          </Button>,
          <Button key='submit' type='primary' onClick={handleOk}>
            {!state.selectedRow?._id ? 'B??????c ti????p theo' : 'Ho??n th??nh'}
          </Button>,
        ]
      } else {
        return [
          <Button key='close' onClick={handleCancel}>
            ??o??ng
          </Button>,
          <Button key='print' type='primary' onClick={handleClickPrint}>
            In phi???u
          </Button>
        ]
      }
    }
    return [
      <Button key='close' onClick={handleCancel}>
        ??o??ng
      </Button>,
      <Button key='submit' type='primary' onClick={handleOk}>
        {!state.selectedRow?._id ? 'B??????c ti????p theo' : 'Ho??n th??nh'}
      </Button>
    ]
  }

  return (
    <Modal
      title={state.selectedRow?.code || 'Bi??n b???n nh???p kho m???i'}
      visible={state.isVisible}
      onCancel={handleCancel}
      cancelText='??o??ng'
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
          <Step title='T???o bi??n b???n nh???p' />
          <Step title='Ch???nh s???a nh???p h??ng' />
          <Step status={state.selectedRow?.state === 'COMPLETED' ? 'finish' : undefined} title='Hoa??n tha??nh nh???p h??ng' />
        </Steps>
        {renderByStep(state.currentStep)}
      </div>
    </Modal>
  );
}))