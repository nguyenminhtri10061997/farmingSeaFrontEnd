import { gql } from '@apollo/client';

export const GET_ALL = gql`
  query vendors {
    vendors {
      _id
      code
      name
      mobile
      address
    }
  }
`

export const CREATE_ONE = gql`
  mutation createVendor($info: infoScalar) {
    createVendor(info: $info) {
      _id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation updateVendor($id: ID!, $info: infoScalar) {
    updateVendor(id: $id, info: $info) {
      _id
    }
  }
`

export const DELETES = gql`
  mutation deleteVendors($ids: [ID]!) {
    deleteVendors(ids: $ids)
  }
`