import { gql } from '@apollo/client';

export const GET_ALL = gql`
  query customers {
    customers {
      _id
      code
      fullName
      mobile
      address
    }
  }
`

export const CREATE_ONE = gql`
  mutation createCustomer($info: infoScalar) {
    createCustomer(info: $info) {
      _id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation updateCustomer($id: ID!, $info: infoScalar) {
    updateCustomer(id: $id, info: $info) {
      _id
    }
  }
`

export const DELETES = gql`
  mutation deleteCustomers($ids: [ID]!) {
    deleteCustomers(ids: $ids)
  }
`