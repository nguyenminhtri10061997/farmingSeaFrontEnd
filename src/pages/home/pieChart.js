import React, { useEffect, useContext, useReducer, useRef } from 'react'
import { Radio } from 'antd'
import * as moment from 'moment'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { reducer, queryData } from '../../commons/commonFunc'
import { GET_ALL } from './gql'
import { AppContext } from '../../configs/appContext'

export default React.memo((props) => {
  const appContext = useContext(AppContext)
  const [state, setState] = useReducer(reducer, {
    dataStockModels: [],
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

  const handleGetDataRenevue = async (dataDefault) => {
    let documents = dataDefault
    if (!documents) {
      documents = await getDocument(
        'SALE',
        startDate.current,
        endDate.current
      )
    }
    const hashIdStockModelCount = {}
    const hashIdStockModel = {}
    documents.forEach(doc => {
      doc.sTransactions.forEach(stran => {
        if (!hashIdStockModelCount[stran.idStockModel]) {
          hashIdStockModelCount[stran.idStockModel] = 0
        }
        hashIdStockModelCount[stran.idStockModel] += stran.count || 0
        if (!hashIdStockModel[stran.idStockModel]) {
          hashIdStockModel[stran.idStockModel] = stran.stockModel
        }
      })
    })
    setState({
      dataStockModels: Object.keys(hashIdStockModelCount).map(key => {
        return ({
          name: hashIdStockModel[key]?.name,
          value: hashIdStockModelCount[key],
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
        <PieChart width={400} height={400}>
          <Tooltip separator=', SL: ' />
          <Pie
            // data={data}
            data={state.dataStockModels || []}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
          >
            {state.dataStockModels?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}