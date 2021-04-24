import React, { useRef, useContext } from 'react'
import { DatePicker } from 'antd'
import * as moment from 'moment'
import { useQuery } from '@apollo/client'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import List from '../commons/list'
import Grid from '../commons/grid'
import ModalComponent from './modal/modal'
import { GET_ALL, GET_ONE } from './gql'
import { AppContext } from '../../configs/appContext'
import { queryData } from '../../commons/commonFunc'

const { RangePicker } = DatePicker

export default React.memo(() => {
  const appContext = useContext(AppContext)
  const modalRef = useRef()

  const startDate = useRef(moment().startOf('day').valueOf())
  const endDate = useRef(moment().endOf('day').valueOf())

  const { data, refetch } = useQuery(GET_ALL, {
    variables: {
      type: 'SALE',
      startDate: startDate.current,
      endDate: endDate.current,
      idSourceCompany: appContext.sourceCompany._id
    },
    fetchPolicy: 'no-cache'
  })

  const handleClickAdd = () => {
    modalRef.current?.handleOpen()
  }

  const handleClickEdit = async (slr) => {
    const resGetOne = await queryData(GET_ONE, {
      id: slr[0]._id
    })
    modalRef.current?.handleOpen(resGetOne?.data?.document)
  }

  const onChangeRangePicker = (dates) => {
    startDate.current = dates[0].valueOf()
    endDate.current = dates[1].endOf('day').valueOf()
    refetch()
  }

  return (
    <List>
      <RangePicker
        defaultValue={[moment(startDate.current), moment(endDate.current)]}
        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
        onChange={onChangeRangePicker}
        allowClear={false}
      />
      <div
        style={{
          height: 'calc(100vh - 259px)'
        }}
      >
        <Grid
          onGridReady={(gridOpts) => {
            gridOpts.api.sizeColumnsToFit()
          }}
          rowData={data?.documents || []}
          columDefs={[
            {
              headerName: 'Mã phiếu',
              field: 'code',
            },
            {
              headerName: 'Tên Khách hàng',
              field: 'desCustomer.fullName',
            },
            {
              headerName: 'Địa chỉ',
              field: 'desCustomer.address',
            },
            {
              headerName: 'SĐT',
              field: 'desCustomer.mobile',
            },
            {
              headerName: 'Tổng tiền',
              field: 'total',
            }
          ]}
          checkboxSelection
          buttons={[
            {
              icon: <PlusOutlined />,
              type: 'default',
              onClick: handleClickAdd,
              tooltip: 'Tạo mới'
            },
            {
              icon: <EditOutlined />,
              type: 'single',
              onClick: handleClickEdit,
              tooltip: 'Xem chi tiết'
            }
          ]}
        />
      </div>
      <ModalComponent
        ref={modalRef}
        refetch={refetch}   
      />
    </List>
  )
})