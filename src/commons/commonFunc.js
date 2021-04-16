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
  const query = hasGql ? inputQuery : gql`${inputQuery}`
  const data = await client.query({
    query,
    variables,
    fetchPolicy
  })
  return data
}

const mutateData = async (inputQuery, variables = {}, hasGql = true) => {
  const mutation = hasGql ? inputQuery : gql`${inputQuery}`
  const data = await client.mutate({
    mutation,
    variables
  })
  return data
}

export {
  reducer,
  patternRule,
  checkDoubleClickFunc,
  queryData,
  mutateData,
}
