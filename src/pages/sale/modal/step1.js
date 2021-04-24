import React, { forwardRef, useEffect, useImperativeHandle, useRef, useReducer } from 'react'
import { Select, Form } from 'antd'
import { client } from '../../../configs/apollo'
import { patternRule, reducer } from '../../../commons/commonFunc'
import { SEARCH_CUSTOMERS } from '../gql'

const { Option } = Select

export default React.memo(forwardRef((props, ref) => {
  const [state, setState] = useReducer(reducer, {
    optsVendor: []
  })

  const [form] = Form.useForm()

  const waiting = useRef()

  const searchCustomers = async (searchString = '', idDefault) => {
    const {
      data: {
        searchCustomers
      }
    } = await client.query({
      query: SEARCH_CUSTOMERS,
      variables: {
        searchString,
        idDefault,
        limit: 30,
      },
      fetchPolicy: 'no-cache'
    })
    return searchCustomers || []
  }

  const handleDidMount = async () => {
    setState({
      optsVendor: await searchCustomers()
    })
  }
  useEffect(() => {
    handleDidMount()
  }, [])

  useImperativeHandle(ref, () => ({
    form
  }))

  const handleSearchCustomer = (val, wait) => {
    if (waiting.current) clearTimeout(waiting.current)
    waiting.current = setTimeout(async () => {
      let optsVendor = await searchCustomers(val)
      setState({
        optsVendor
      })
    }, wait || 1000)
  }

  return (
    <div
      style={{
        marginTop: '1rem'
      }}
    >
      <Form
        layout='vertical'
        form={form}
      >
        <Form.Item
          label='Khách hàng'
          name='idDesCustomer'
          rules={[patternRule.required('Khách hàng là bắt buộc')]}
        >
          <Select
            placeholder='Chọn khách hàng'
            onSearch={handleSearchCustomer}
            showSearch
            filterOption={false}
          >
            {state.optsVendor.map((item, i) => <Option key={`optsVendor-${i}`} value={item._id}>{item.code} - {item.fullName}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
}))