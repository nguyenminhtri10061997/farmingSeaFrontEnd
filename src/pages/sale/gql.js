import { gql } from '@apollo/client';

export const GET_ALL = gql`
  query ($type: EnumTypeDocument, $startDate: Float, $endDate: Float, $idSourceCompany: ID) {
    documents (type: $type, idSourceCompany: $idSourceCompany, startDate: $startDate, endDate: $endDate){
      _id
      code
      state
      desCustomer {
        fullName
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
      desCustomer {
        fullName
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
        salePrice
      }
    }
  }
`

export const CREATE_ONE = gql`
  mutation createDocumentSale($info: infoScalar) {
    createDocumentSale(info: $info) {
      _id
      code
      state
      desCustomer {
        fullName
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

export const SEARCH_CUSTOMERS = gql`
  query searchCustomers($searchString: String!, $limit: Int, $idDefault: ID) {
    searchCustomers(searchString: $searchString, limit: $limit, idDefault: $idDefault) {
      _id
      code
      fullName
    }
  }
`

export const SEARCH_STOCKMODELS = gql`
  query searchStockModels($searchString: String!, $limit: Int, $idDefault: ID, $idCompany: ID) {
    searchStockModels(searchString: $searchString, limit: $limit, idDefault: $idDefault, idCompany: $idCompany) {
      _id
      code
      name
      detail {
        unit
        factor
        realFactor
        costPrice
      }
      countByStore
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
  mutation verifyCompleteDocumentSale($id: ID!) {
    verifyCompleteDocumentSale(id: $id)
  }
`

export const CANCEL_COMPLETED_DOCUMENT = gql`
  mutation canceledCompletedDocumentSale($id: ID!) {
    canceledCompletedDocumentSale(id: $id)
  }
`