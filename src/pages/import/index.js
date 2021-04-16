import React, { useRef, useContext } from 'react'
import { notification, Modal, DatePicker } from 'antd'
import moment from 'moment'
import { useMutation, useQuery } from '@apollo/client'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import List from '../commons/list'
import Grid from '../commons/grid'
import ModalComponent from './modal'
import { GET_ALL, DELETES } from './gql'
import { AppContext } from '../../configs/appContext'

const { confirm } = Modal
const { RangePicker } = DatePicker

export default React.memo(() => {
  const appContext = useContext(AppContext)
  const modalRef = useRef()

  const startDate = useRef(moment().startOf('day').valueOf())
  const endDate = useRef(moment().endOf('day').valueOf())

  const { data, refetch } = useQuery(GET_ALL, {
    variables: {
      type: 'IMPORT',
      startDate: startDate.current,
      endDate: endDate.current,
      idDesCompany: appContext.sourceCompany._id
    },
    fetchPolicy: 'no-cache'
  })
  const [deleteCompanies] = useMutation(DELETES, { fetchPolicy: 'no-cache' })

  const handleClickAdd = () => {
    modalRef.current?.handleOpen()
  }

  const handleClickEdit = (slr) => {
    modalRef.current?.handleOpen(slr[0])
  }

  const deletes = async (ids) => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc muốn xóa các dòng đã chọn',
      onOk: () => {
        return new Promise((resolve) => {
          const res = deleteCompanies({ variables: { ids } })
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
          refetch()
          resolve()
        }).catch((err) => console.log(err))
      },
      onCancel() {},
    });
  }

  const handleClickDeletes = (slr) => {
    deletes(slr.map(i => i._id))
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
      />
      <Grid
        onGridReady={(gridOpts) => {
          gridOpts.api.sizeColumnsToFit()
        }}
        rowData={data?.documents || []}
        columDefs={[
          {
            headerName: 'Mã phiếu nhập',
            field: 'code',
          },
          {
            headerName: 'Tên nhà cung cấp',
            field: 'name',
          },
          {
            headerName: 'Địa chỉ',
            field: 'address',
          },
          {
            headerName: 'SĐT',
            field: 'mobile',
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
            onClick: handleClickAdd
          },
          {
            icon: <EditOutlined />,
            type: 'single',
            onClick: handleClickEdit
          },
          {
            icon: <DeleteOutlined />,
            type: 'multiple',
            onClick: handleClickDeletes
          }
        ]}
      />
      <ModalComponent
        ref={modalRef}
        refetch={refetch}   
      />
    </List>
  )
})