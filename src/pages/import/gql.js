import { gql } from '@apollo/client';

export const GET_ALL = gql`
  query ($type: EnumTypeDocument, $startDate: Float, $endDate: Float, $idSourceCompany: ID) {
    documents (type: $type, idSourceCompany: $idSourceCompany, startDate: $startDate, endDate: $endDate){
      _id
      code
      state
      srcVendor {
        name
        mobile
        address
      }
    }
  }
`

export const GET_ONE = gql`
  query ($id: ID!) {
    document (id: $id){
      _id
      code
      state
      srcVendor {
        name
        mobile
        address
      }
      createdAt
      createdBy {
        username
      }
      sTransactions {
        _id
        idStockModel
        stockModel {
          code
          name
          detail {
            unit
          }
        }
        quantity
        buyPrice
      }
    }
  }
`

export const CREATE_ONE = gql`
  mutation createDocument($info: infoScalar) {
    createDocument(info: $info) {
      _id
      code
      state
      srcVendor {
        name
        mobile
        address
      }
      createdAt
      createdBy {
        username
      }
    }
  }
`

export const SEARCH_VENDORS = gql`
  query searchVendors($searchString: String!, $limit: Int, $idDefault: ID) {
    searchVendors(searchString: $searchString, limit: $limit, idDefault: $idDefault) {
      _id
      code
      name
    }
  }
`

export const SEARCH_STOCKMODELS = gql`
  query searchStockModels($searchString: String!, $limit: Int, $idDefault: ID) {
    searchStockModels(searchString: $searchString, limit: $limit, idDefault: $idDefault) {
      _id
      code
      name
      detail {
        unit
        factor
      }
    }
  }
`

export const CREATE_STRANSACTION = gql`
  mutation createSTransaction($info: infoScalar!) {
    createSTransaction(info: $info) {
      _id
    }
  }
`

export const DELETE_STRANSACTIONS = gql`
  mutation deleteSTransactions($ids: [ID]!) {
    deleteSTransactions(ids: $ids)
  }
`

export const UPDATE_STRANSACTIONS = gql`
  mutation updateSTransaction($id: ID!, $info: infoScalar!) {
    updateSTransaction(id: $id, info: $info) {
      _id
    }
  }
`
export const CANCEL_DOCUMENT = gql`
  mutation canceledDocument($id: ID!) {
    canceledDocument(id: $id)
  }
`
export const VERIFY_DOCUMENT = gql`
  mutation verifyCompleteDocument($id: ID!) {
    verifyCompleteDocument(id: $id)
  }
`