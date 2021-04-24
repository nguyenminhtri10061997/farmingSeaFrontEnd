import React, { useEffect, useContext, useReducer, useRef } from 'react'
import { Statistic, DatePicker } from 'antd'
import * as moment from 'moment'
import './index.scss'
import { reducer, queryData, FormatNumber } from '../../commons/commonFunc'
import { GET_ALL } from './gql'
import { AppContext } from '../../configs/appContext'

const { RangePicker } = DatePicker

export default React.memo((props) => {
  const appContext = useContext(AppContext)
  const [state, setState] = useReducer(reducer, {
    total: 0,
  })

  const startDate = useRef(moment().startOf('isoWeek').valueOf())
  const endDate = useRef(moment().endOf('isoWeek').valueOf())

  const getDocument = async (
    type,
    startDate,
    endDate,
  ) => {
    const {
      data: {
        documents
      }
    } = await queryData(GET_ALL, {
      type,
      startDate,
      endDate,
      idSourceCompany: appContext.sourceCompany._id,
      state: 'COMPLETED'
    })
    return documents || []
  }
  const handleGetDataRenevue = async (dataDefault) => {
    let documents = dataDefault
    if (!documents) {
      documents = await getDocument(
        'SALE',
        startDate.current,
        endDate.current
      )
    }
    let total = 0
    documents.forEach(doc => {
      let totalSTran = 0
      let totalCostTran = 0
      doc.sTransactions.forEach(sTran => {
        sTran.quantity.forEach((quan, idx) => {
          if (quan) {
            totalSTran += (quan || 0) * (sTran.salePrice[idx] || 0)
          }
          totalCostTran += (sTran.count || 0) * (sTran.costPrice || 0)
        })
      })
      total += totalSTran - totalCostTran
    })
    setState({
      total: Math.round(total * 100) / 100
    })
  }

  const handleDidMount = async () => {
    handleGetDataRenevue(props.dataDocumentDefaults)
  }

  useEffect(() => {
    handleDidMount()
  }, [props.dataDocumentDefaults])

  const onChangeRangePicker = (dates) => {
    startDate.current = dates[0].valueOf()
    endDate.current = dates[1].endOf('day').valueOf()
    handleGetDataRenevue()
  }
  return (
    <div className='content-card'>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className='chart'
      >
        <Statistic
          value={state.total}
          precision={2}
          valueStyle={{
            color: '#3f8600',
            fontSize: 'xx-large'
          }}
          suffix='VNĐ'
          style={{
            paddingBottom: '3rem'
          }}
          formatter={(val) => FormatNumber(val)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <RangePicker
          defaultValue={[moment(startDate.current), moment(endDate.current)]}
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          onChange={onChangeRangePicker}
          allowClear={false}
          size='small'
        />
      </div>
    </div>
  )
})