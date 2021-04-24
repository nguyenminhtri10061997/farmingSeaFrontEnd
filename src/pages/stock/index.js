import React from 'react'
import List from '../commons/list'
import Grid from '../commons/grid'
import { useQuery } from '@apollo/client'
import { GET_ALL } from './gql'

export default React.memo(() => {
  const { data } = useQuery(GET_ALL, {
    fetchPolicy: 'no-cache'
  })
  return (
    <List>
      <Grid
        onGridReady={(gridOpts) => {
          gridOpts.api.sizeColumnsToFit()
        }}
        rowData={data?.stocks || []}
        columDefs={[
          {
            headerName: 'Mã hàng hóa',
            field: 'stockModel.code',
          },
          {
            headerName: 'Tên hàng hóa',
            field: 'stockModel.name',
          },
          {
            headerName: 'SL Tồn',
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
            headerName: 'Giá vốn',
            field: 'stockModel.detail.costPrice',
            valueGetter: ({ data }) => {
              return data.stockModel?.detail?.unit?.reduce((t, unit, idx) => {
                return `${t}, ${Math.floor((data.stockModel?.detail.costPrice || 0) * (data.stockModel?.detail.realFactor[idx] || 0) * 100) / 100}/${unit || ''}` 
              }, '').substr(2)
            },
            width: 100
          },
        ]}
        checkboxSelection
        buttons={[]}
      />
    </List>
  )
})