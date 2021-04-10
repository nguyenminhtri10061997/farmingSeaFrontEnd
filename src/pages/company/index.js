import React, { useRef } from 'react'
import { notification } from 'antd'
import List from '../commons/list'
import Grid from '../commons/grid'
import { useMutation } from '@apollo/client'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import Modal from './modal'
import { useQuery } from '@apollo/client'
import { GET_ALL, DELETES } from './gql'

export default React.memo(() => {
  const modalRef = useRef()

  const { data, refetch } = useQuery(GET_ALL)
  const [deleteCompanies] = useMutation(DELETES)

  const handleClickAdd = () => {
    modalRef.current?.handleOpen()
  }

  const handleClickEdit = (slr) => {
    modalRef.current?.handleOpen(slr[0])
  }

  const deletes = async (ids) => {
    try {
      const res = await deleteCompanies({ variables: { ids } })
      if (res.errors) {
        if (res.errors.message.includes('!Failed to fetch')) {
          notification.error({
            message: 'Lỗi Thêm mới',
            description: 'Sự cố mạng',
            placement: 'topLeft',
          })
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
      refetch()
    } catch (err) {
      console.log(err)
    }
  }

  const handleClickDeletes = (slr) => {
    deletes(slr.map(i => i._id))
  }

  return (
    <List>
      <Grid
        rowData={data?.conpanies || []}
        columDefs={[
          {
            headerName: 'Mã công ty',
            field: 'code',
          },
          {
            headerName: 'Tên công ty',
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
      <Modal
        ref={modalRef}
        refetch={refetch}   
      />
    </List>
  )
})