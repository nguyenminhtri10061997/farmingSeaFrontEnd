import React, { useRef } from 'react'
import { notification, Modal } from 'antd'
import List from '../commons/list'
import Grid from '../commons/grid'
import { useMutation } from '@apollo/client'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import ModalComponent from './modal'
import { useQuery } from '@apollo/client'
import { GET_ALL, DELETES } from './gql'

const { confirm } = Modal

export default React.memo(() => {
  const modalRef = useRef()

  const { data, refetch } = useQuery(GET_ALL, {
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

  return (
    <List>
      <Grid
        onGridReady={(gridOpts) => {
          gridOpts.api.sizeColumnsToFit()
        }}
        rowData={data?.vendors || []}
        columDefs={[
          {
            headerName: 'Mã nhà cung cấp',
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