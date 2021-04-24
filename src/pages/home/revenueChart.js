import React, { useEffect, useContext, useReducer, useRef } from 'react'
import { Radio } from 'antd'
import * as moment from 'moment'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './index.scss'
import { reducer, queryData } from '../../commons/commonFunc'
import { GET_ALL } from './gql'
import { AppContext } from '../../configs/appContext'

export default React.memo((props) => {
  const appContext = useContext(AppContext)
  const [state, setState] = useReducer(reducer, {
    dataRevenueAndProfit: [],
  })

  const startDate = useRef(moment().startOf('isoWeek').valueOf())
  const endDate = useRef(moment().endOf('isoWeek').valueOf())
  const radioRevenueRef = useRef('week')

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

  const weekOfMonth = (input = moment()) => {
    const firstDayOfMonth = input.clone().startOf('month');
    const firstDayOfWeek = firstDayOfMonth.clone().startOf('week');
  
    const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days');
  
    return Math.ceil((input.date() + offset) / 7);
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
    const hashByDate = {}
    documents.forEach(doc => {
      let date
      if (radioRevenueRef.current === 'week') {
        date = moment(doc.createdAt).format('DD/MM')
      } else if (radioRevenueRef.current === 'month') {
        var nthOfMoth = weekOfMonth(moment(doc.createdAt))
        date = moment(doc.createdAt).format(`tuần ${nthOfMoth}/MM`)
      } else {
        date = moment(doc.createdAt).format('YYYY')
      }
      if (!hashByDate[date]) {
        hashByDate[date] = []
      }
      hashByDate[date].push(doc)
    })
    setState({
      dataRevenueAndProfit: Object.keys(hashByDate).map(key => {
        let totalRevenue = 0
        let totalProfit = 0
        const documents = hashByDate[key]
        documents.forEach(i => {
          totalRevenue += i.sTransactions.reduce((t, stran) => {
            const totalStran = stran.quantity.reduce((tQ, quan, idxQ) => {
              if (quan) {
                return tQ + quan * stran.salePrice[idxQ]
              }
              return tQ
            }, 0)
            return t + totalStran
          }, 0)
          totalProfit += i.sTransactions.reduce((t, stran) => {
            const totalStran = stran.quantity.reduce((tQ, quan, idxQ) => {
              if (quan) {
                return tQ + quan * stran.salePrice[idxQ]
              }
              return tQ
            }, 0)
            const totalCostStran = stran.count * stran.costPrice
            return t + (totalStran - totalCostStran)
          }, 0)
        })
        return ({
          date: key,
          totalRevenue,
          totalProfit
        })
      })
    })
  }

  const handleDidMount = async () => {
    handleGetDataRenevue(props.dataDocumentDefaults)
  }

  useEffect(() => {
    handleDidMount()
  }, [props.dataDocumentDefaults])

  const handleChangeRadioRevenue = (e) => {
    const val = e.target.value
    radioRevenueRef.current = val
    if (val === 'week') {
      startDate.current = moment().startOf('isoWeek').valueOf()
      endDate.current = moment().endOf('isoWeek').valueOf()
    } else if (val === 'month') {
      startDate.current = moment().startOf('month').valueOf()
      endDate.current = moment().endOf('month').valueOf()
    } else {
      startDate.current = moment().startOf('year').valueOf()
      endDate.current = moment().endOf('year').valueOf()
    }
    handleGetDataRenevue()
  }

  return (
    <div className='content-card'>
      <div className='chart'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            width='100%'
            height='100%'
            data={state.dataRevenueAndProfit || []}
            // margin={{
            //   top: 10,
            //   right: 20,
            // }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line name='Doanh thu' type='monotone' dataKey='totalRevenue' stroke='#8884d8' activeDot={{ r: 8 }} />
            <Line name='Lợi nhuận' type='monotone' dataKey='totalProfit' stroke='#FF9900' activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Radio.Group defaultValue='week' buttonStyle='solid' size='small' onChange={handleChangeRadioRevenue}>
          <Radio.Button type='text' value='week'>Tuần này</Radio.Button>
          <Radio.Button type='text' value='month'>Tháng này</Radio.Button>
          <Radio.Button type='text' value='year'>Năm nay</Radio.Button>
        </Radio.Group>
      </div>
    </div>
  )
})