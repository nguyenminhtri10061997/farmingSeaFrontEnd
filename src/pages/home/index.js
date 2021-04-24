import React, { useEffect, useContext, useReducer } from 'react'
import { Card, Row, Col } from 'antd'
import * as moment from 'moment'
import { DollarCircleTwoTone } from '@ant-design/icons'
import './index.scss'
import { reducer, queryData } from '../../commons/commonFunc'
import { GET_ALL } from './gql'
import { AppContext } from '../../configs/appContext'
import RevenueChart from './revenueChart'
import PieChartCom from './pieChart'
import TotalRevenue from './totalRevenue'
import TotalProfit from './totalProfit'
import AlertInfo from './alertInfo'
import Axios from 'axios'

export default React.memo(() => {
  const appContext = useContext(AppContext)
  const [state, setState] = useReducer(reducer, {
    dataDocuments: [],
    weather: {}
  })

  const getDocument = async () => {
    const {
      data: {
        documents
      }
    } = await queryData(GET_ALL, {
      type: 'SALE',
      startDate: moment().startOf('isoWeek').valueOf(),
      endDate: moment().endOf('isoWeek').valueOf(),
      idSourceCompany: appContext.sourceCompany._id,
      state: 'COMPLETED'
    })
    return documents || []
  }

  const handleDidMount = async () => {
    const resWeather = await Axios({
      method: 'get',
      url: 'https://api.openweathermap.org/data/2.5/weather?id=1586350&appid=12586da0970bf3c85ad5a1ac36fd9418&lang=VI&units=metric',
    })
    setState({
      dataDocuments: await getDocument(),
      weather: resWeather.data
    })
  }

  useEffect(() => {
    handleDidMount()
  }, [])
  return (
    <div
      className='home-content'
    >
      <div>
        <h3
          style={{
            textAlign: 'center',
            color: 'deeppink'
          }}
        >
          Xin chào {appContext.currentUser.username}
        </h3>
      </div>
      <div
        className='card'
      >
        <Row
          gutter={16}
          style={{
            margin: 0
          }}
        >
          <Col
            xs={24} sm={24} md={12} lg={6} xl={6}
          >
            <Card
              hoverable
              type='inner'
            >
              <div
                className='titleCard'  
              >
                <span>
                  <DollarCircleTwoTone spin style={{ fontSize: 50 }} />
                </span>
                <span className='text'>
                  Doanh thu và lợi nhuận
                </span>
              </div>
              <RevenueChart
                dataDocumentDefaults={state.dataDocuments}
              />
            </Card>
          </Col>
          <Col
            xs={24} sm={24} md={12} lg={6} xl={6}
          >
            <Card
              hoverable
              type='inner'
            >
              <div
                className='titleCard'  
              >
                <span>
                  <DollarCircleTwoTone spin style={{ fontSize: 50 }} />
                </span>
                <span className='text'>
                  Hàng bán nhiều
                </span>
              </div>
              <PieChartCom
                dataDocumentDefaults={state.dataDocuments}
              />
            </Card>
          </Col>
          <Col
            xs={24} sm={24} md={12} lg={6} xl={6}
          >
            <Card
              hoverable
              type='inner'
            >
              <div
                className='titleCard'  
              >
                <span>
                  <DollarCircleTwoTone spin style={{ fontSize: 50 }} />
                </span>
                <span className='text'>
                  Tổng doanh thu
                </span>
              </div>
              <TotalRevenue
                dataDocumentDefaults={state.dataDocuments}
              />
            </Card>
          </Col>
          <Col
            xs={24} sm={24} md={12} lg={6} xl={6}
          >
            <Card
              hoverable
              type='inner'
            >
              <div
                className='titleCard'  
              >
                <span>
                  <DollarCircleTwoTone spin style={{ fontSize: 50 }} />
                </span>
                <span className='text'>
                  Tổng lợi nhuận
                </span>
              </div>
              <TotalProfit
                dataDocumentDefaults={state.dataDocuments}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <div>
        <AlertInfo />
      </div>
      <div className='content-weather'>
        <div>
          <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/3219/logo.svg' alt='' />
        </div>
        <div
          style={{
            fontSize: 'initial',
            fontWeight: 'bold'
          }}
        >
          {state.weather?.name || ''}
        </div>
        <div>
          {state.weather?.weather?.reduce((t, i) => `${t}, ${i.description}`, '')?.substr(2) || ''}
        </div>
        <div>
          Nhiệt độ: {state.weather?.main?.temp || ''} °C, độ ẩm {state.weather?.main?.humidity} %
        </div>
      </div>
    </div>
  )
})