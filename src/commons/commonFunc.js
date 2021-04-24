import gql from 'graphql-tag'
import { client } from '../configs/apollo'

const reducer = (prevState, state) => ({
  ...prevState,
  ...state,
})

const patternRule = {
  notOnlySpace: (mess) => ({
    pattern: '[^\\s+$]',
    message: mess || 'Tên không hợp lệ'
  }),
  preSpace: (mess) => ({
    pattern: /^[^\s]/,
    message: mess || 'Không được có dấu cách đầu dòng'
  }),
  required: (mess) => ({
    required: true,
    message: mess || 'Không được để trống!'
  }),
  notBracket: (mess) => ({
    pattern: /^[^()]+$/,
    message: mess || 'Vui lòng không sử dụng dấu đóng mở ngoặc tròn'
  }),
  email: (mess) => ({
    type: 'email',
    message: mess || 'Vui lòng nhập chính xác email'
  }),
  notCharacter: (mess) => ({
    pattern: /^[0-9]+$/,
    message: mess || 'Chỉ cho phép nhập số'
  })
}


const checkDoubleClickFunc = async (varCheckRef, callback, variableCallback = []) => {
  if (varCheckRef.current === true) {
    return
  }
  // eslint-disable-next-line
  varCheckRef.current = true
  try {
    await callback(...variableCallback)
  } catch (err) {
    console.error(err)
    // eslint-disable-next-line
    varCheckRef.current = false
  }
  // eslint-disable-next-line
  varCheckRef.current = false
}

const queryData = async (inputQuery, variables = {}, hasGql = true, fetchPolicy = 'no-cache') => {
  try {
    const query = hasGql ? inputQuery : gql`${inputQuery}`
    const data = await client.query({
      query,
      variables,
      fetchPolicy
    })
    return data
  } catch(err) {
    return {
      errors: {
        message: err
      }
    }
  }
}

const mutateData = async (inputQuery, variables = {}, hasGql = true) => {
  const mutation = hasGql ? inputQuery : gql`${inputQuery}`
  const data = await client.mutate({
    mutation,
    variables
  })
  return data
}

const FormatNumber = (varValue, decimalLength) => {
  const value = !varValue ? '0' : varValue
  let tmp = typeof value === 'string' ? value : value.toString()
  tmp = tmp.replace(/\$\s?|(,*)/g, '')

  if (tmp.indexOf('.') !== -1) {
    tmp = Number(tmp).toFixed(decimalLength !== undefined ? decimalLength : 2)
    const num1 = tmp.split('.')[0]
    const num2 = tmp.split('.')[1].slice(0, decimalLength !== undefined ? decimalLength : 2)
    return `${num1.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${Number(`0.${num2}`) !== 0 ? '.' : ''}${`${Number(`0.${num2}`)}`.slice(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }
  return tmp.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export {
  reducer,
  patternRule,
  checkDoubleClickFunc,
  queryData,
  mutateData,
  FormatNumber
}
