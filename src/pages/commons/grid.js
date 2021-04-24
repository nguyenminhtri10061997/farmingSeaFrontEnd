
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import { Button, Tooltip } from 'antd'
import React, { useRef, useReducer, useEffect } from 'react'
import { reducer } from '../../commons/commonFunc'
// import 'ag-grid-enterprise'

const Grid = React.memo(({ buttons, columDefs, checkboxSelection, onGridReady, ...props }) => {
  const [state, setState] = useReducer(reducer, {
    typeSelectedRow: 'none'
  })
  const gridApi = useRef()
  const onPageSizeChanged = (e) => {
    const val = e.target.value
    gridApi.current.paginationSetPageSize(Number(val))
  }
  const handleChangeSelected = () => {
    if (gridApi.current.getSelectedRows().length > 1) {
      if (state.typeSelectedRow !== 'multi') {
        setState({
          typeSelectedRow: 'multi'
        })
      }
    } else if (gridApi.current.getSelectedRows().length === 1) {
      setState({
        typeSelectedRow: 'single'
      })
    } else {
      setState({
        typeSelectedRow: 'none'
      })
    }
  }

  useEffect(() => {
    gridApi.current?.deselectAll()
  }, [props.rowData])

  return (
    <div className='grid-content ag-theme-alpine'>
      <div className='header-aggrid'>
        <div className='header-aggrid-pageSize'>
          Page Size:
          <select defaultValue='10' onChange={onPageSizeChanged} id='page-size'>
            <option value='10'>
              10
            </option>
            <option value='100'>100</option>
            <option value='500'>500</option>
          </select>
        </div>
        <div className='header-aggrid-button'>
          {buttons?.map((button, idx) => {
            let isDisable = false
            if (
              (button.type === 'single' && state.typeSelectedRow !== 'single')
              || (button.type === 'multiple' && state.typeSelectedRow === 'none')
            ) {
              isDisable = true
            }
            return (
              <Tooltip
                key={`buttonGrid_${idx}`}
                title={button.tooltip || ''}
              >
                <Button
                  type='link'
                  icon={button.icon}
                  size='default'
                  disabled={isDisable}
                  onClick={() => {
                    if (button.onClick) {
                      button.onClick(gridApi.current.getSelectedRows())
                    }
                  }}
                />
              </Tooltip>
            )
          })}
        </div>
      </div>
      <AgGridReact
        rowSelection='multiple'
        defaultColDef={{
          sortable: true,
          floatingFilter: true,
          suppressMenu: true,
          filter: 'agTextColumnFilter',
          resizable: true
        }}
        onGridReady={(gridOpts) => {
          gridApi.current = gridOpts.api
          if (typeof onGridReady === 'function') {
            onGridReady(gridOpts)
          }
        }}
        pagination={true}
        paginationPageSize={10}
        onSelectionChanged={handleChangeSelected}
        {...props}
      >
        {
          columDefs?.map(({ field, headerName, ...columDefs}, idx) => {
            let propsFirstColumn = {}
            if (idx === 0) {
              if (checkboxSelection) {
                propsFirstColumn = {
                  checkboxSelection: true,
                  headerCheckboxSelection: true,
                }
              }
            }
            return (
              <AgGridColumn
                key={idx}
                field={field}
                headerName={headerName}
                {...propsFirstColumn}
                {...columDefs}
              />
            )
          })
        }
      </AgGridReact>
    </div>
  )
})

export default Grid