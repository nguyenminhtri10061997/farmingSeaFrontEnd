import { gql } from '@apollo/client';

export const GET_ALL = gql`
  query ($type: EnumTypeDocument, $startDate: Float, $endDate: Float, $idDesCompany: ID) {
    documents (type: $type, idDesCompany: $idDesCompany, startDate: $startDate, endDate: $endDate){
      _id
      code
      srcVendor {
        name
        mobile
        address
      }
    }
  }
`

export const CREATE_ONE = gql`
  mutation createDocument($info: infoScalar) {
    createDocument(info: $info) {
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

export const SEARCH_VENDORS = gql`
  query searchVendors($searchString: String!, $limit: Int, $idDefault: ID) {
    searchVendors(searchString: $searchString, limit: $limit, idDefault: $idDefault) {
      _id
      code
      name
    }
  }
`