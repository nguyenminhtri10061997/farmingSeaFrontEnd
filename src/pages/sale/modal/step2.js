import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Row, Col, notification, Modal } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import Grid from '../../commons/grid'
import * as moment from 'moment'
import AddStock from './modalAddStockModel'
import { FormatNumber, mutateData } from '../../../commons/commonFunc'
import {
  DELETE_STRANSACTIONS
} from '../gql'

const { confirm } = Modal

export default React.memo(forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({}))

  const modalAddStockModelRef = useRef()

  const handleClickAddStockModel = () => {
    modalAddStockModelRef.current.handleOpen()
  }

  const handleClickEdit = (slrs) => {
    modalAddStockModelRef.current.handleOpen(slrs[0])
  }

  const deletes = async (ids) => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc muốn xóa các dòng đã chọn',
      onOk: async () => {
        return new Promise((resolve) => {
          mutateData(DELETE_STRANSACTIONS, {
            ids
          }).then((res) => {
            if (res.errors) {
              if (res.errors.message.includes('!Failed to fetch')) {
                notification.error({
                  message: 'Lỗi xóa',
                  description: 'Sự cố mạng',
                  placement: 'topLeft',
                })
                return
              }
              notification.error({
                message: 'Lỗi Xóa',
                description: 'Có lỗi khi xóa',
                placement: 'topLeft',
              })
              return
            }
            notification.success({
              message: 'Xóa',
              description: 'Xóa thành công',
              placement: 'bottomLeft',
            })
            props.refreshSelectedRow()
            resolve()
          })
        }).catch((err) => console.log(err))
      },
      onCancel() {},
    });
  }

  const handleClickDeletes = (slr) => {
    deletes(slr.map(i => i._id))
  }

  return (
    <div
      style={{
        marginTop: '1rem'
      }}
    >
      <div>
        <Row gutter={16}>
          <Col span={6}>
            <div>Mã đơn hàng: <b>{props.selectedRow.code}</b></div>
          </Col>
          <Col span={6}>
            <div>Khách hàng: <b>{props.selectedRow.desCustomer?.fullName || ''}</b></div>
            <div>Địa chỉ: <b>{props.selectedRow.desCustomer?.address || ''}</b></div>
            <div>SĐT: <b>{props.selectedRow.desCustomer?.mobile || ''}</b></div>
          </Col>
          <Col span={6}>
            <div>Thời gian tạo: <b>{moment(props.selectedRow.createdAt).format('HH:mm DD/MM/YYYY')}</b></div>
            <div>Người tạo: <b>{props.selectedRow.createdBy?.username || ''}</b></div>
            <div>Tổng tiền hàng: <b>{FormatNumber(props.selectedRow?.sTransactions?.reduce((t, sTran) => {
              let totalTran = 0
              sTran.quantity.forEach((quan, idx) => {
                if (quan) {
                  totalTran += quan * sTran.salePrice[idx]
                }
              })
              return t + totalTran
            }, 0) || 0)}</b></div>
          </Col>
        </Row>
      </div>
      <div
        style={{
          height: '50vh'
        }}
      >
        <Grid
          onGridReady={(gridOpts) => {
            gridOpts.api.sizeColumnsToFit()
          }}
          rowData={props.selectedRow.sTransactions || []}
          columDefs={[
            {
              headerName: 'Mã hàng',
              field: 'stockModel.code',
            },
            {
              headerName: 'Tên hàng',
              field: 'stockModel.name',
            },
            {
              headerName: 'SL',
              valueGetter: ({ data }) => {
                return data.quantity?.reduce((t, quan, idx) => {
                  if (quan) {
                    return `${t}, ${quan} ${data.stockModel?.detail?.unit[idx] || ''}` 
                  }
                  return t
                }, '').substr(2)
              }
            },
            {
              headerName: 'Đơn giá nhập',
              valueGetter: ({ data }) => {
                return data.salePrice?.reduce((t, price, idx) => {
                  if (price) {
                    return `${t}, 1 ${data.stockModel?.detail?.unit[idx] || ''} = ${FormatNumber(price)}` 
                  }
                  return t
                }, '').substr(2)
              }
            },
            {
              headerName: 'Thành tiền',
              field: 'total',
              valueGetter: ({ data }) => {
                return FormatNumber(data.quantity?.reduce((t, quan, idx) => {
                  if (quan) {
                    return t + quan * data.salePrice[idx]
                  }
                  return t
                }, 0))
              }
            }
          ]}
          checkboxSelection
          buttons={[
            {
              icon: <PlusOutlined />,
              type: 'default',
              onClick: handleClickAddStockModel,
              tooltip: 'Thêm hàng'
            },
            {
              icon: <EditOutlined />,
              type: 'single',
              onClick: handleClickEdit,
              tooltip: 'Sửa hàng'
            },
            {
              icon: <DeleteOutlined />,
              type: 'multiple',
              onClick: handleClickDeletes,
              tooltip: 'Xóa hàng'
            }
          ]}
        />
        <AddStock
          ref={modalAddStockModelRef}
          selectedRow={props.selectedRow}
          refreshSelectedRow={props.refreshSelectedRow}
        />
      </div>
    </div>
  )
}))