import { gql } from '@apollo/client';

export const GET_ALL = gql`
  query stockModels {
    stockModels {
      _id
      code
      name
      detail {
        unit
        factor
        buyPrice
        costPrice
      }
    }
  }
`

export const CREATE_ONE = gql`
  mutation createStockModel($info: infoScalar) {
    createStockModel(info: $info) {
      _id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation updateStockModel($id: ID!, $info: infoScalar) {
    updateStockModel(id: $id, info: $info) {
      _id
    }
  }
`

export const DELETES = gql`
  mutation deleteStockModels($ids: [ID]!) {
    deleteStockModels(ids: $ids)
  }
`