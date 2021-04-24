import React, { forwardRef, useImperativeHandle } from 'react'
import { Row, Col } from 'antd'
import Grid from '../../commons/grid'
import * as moment from 'moment'
import { FormatNumber } from '../../../commons/commonFunc'

export default React.memo(forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({}))

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
            <div>Nhà cung cấp: <b>{props.selectedRow.srcVendor?.name || ''}</b></div>
            <div>Địa chỉ: <b>{props.selectedRow.srcVendor?.address || ''}</b></div>
            <div>SĐT: <b>{props.selectedRow.srcVendor?.mobile || ''}</b></div>
          </Col>
          <Col span={6}>
            <div>Thời gian tạo: <b>{moment(props.selectedRow.createdAt).format('HH:mm DD/MM/YYYY')}</b></div>
            <div>Người tạo: <b>{props.selectedRow.createdBy?.username || ''}</b></div>
            <div>Tổng tiền hàng: <b>{FormatNumber(props.selectedRow?.sTransactions?.reduce((t, tran) => {
              let totalTran = 0
              tran.quantity.forEach((quan, idx) => {
                if (quan) {
                  totalTran += quan * tran.salePrice[idx]
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
          buttons={[]}
        />
      </div>
    </div>
  )
}))