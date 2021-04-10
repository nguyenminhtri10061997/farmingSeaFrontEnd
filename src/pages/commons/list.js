
import React from 'react'
import './list.scss'

export default ({ children }) => {
  return (
    <div className='list'>
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
        className='ag-theme-alpine'
      >
        {children}
      </div>
    </div>
  )
}