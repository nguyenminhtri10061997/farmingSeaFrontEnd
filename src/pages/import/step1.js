import React, { forwardRef, useEffect, useImperativeHandle, useRef, useReducer } from 'react'
import { Select, Form } from 'antd'
import { client } from '../../configs/apollo'
import { patternRule, reducer } from '../../commons/commonFunc'
import { SEARCH_VENDORS } from './gql'

const { Option } = Select

export default React.memo(forwardRef((props, ref) => {
  const [state, setState] = useReducer(reducer, {
    optsVendor: []
  })

  const [form] = Form.useForm()

  const waiting = useRef()

  const searchVendors = async (searchString = '', idDefault) => {
    const {
      data: {
        searchVendors
      }
    } = await client.query({
      query: SEARCH_VENDORS,
      variables: {
        searchString,
        idDefault,
        limit: 30,
      },
      fetchPolicy: 'no-cache'
    })
    return searchVendors || []
  }

  const handleDidMount = async () => {
    setState({
      optsVendor: await searchVendors()
    })
  }
  useEffect(() => {
    handleDidMount()
  }, [])

  useImperativeHandle(ref, () => ({}))

  const handleSearchVendor = (val, wait) => {
    if (waiting.current) clearTimeout(waiting.current)
    waiting.current = setTimeout(async () => {
      let optsVendor = await searchVendors(val)
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
          label='Nhà cung cấp'
          name='idVendor'
          rules={[patternRule.required('Nhà cung cấp là bắt buộc')]}
        >
          <Select
            placeholder='Chọn nhà cung cấp'
            onSearch={handleSearchVendor}
            showSearch
            filterOption={false}
          >
            {state.optsVendor.map((item, i) => <Option key={`optsVendor-${i}`} value={item._id}>{item.name}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
}))