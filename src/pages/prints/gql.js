import { gql } from '@apollo/client';

export const GET_DOCUMENT = gql`
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
    desCompany {
      name
      mobile
      address
    }
    desCustomer {
      fullName
      mobile
      address
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
      salePrice
    }
  }
}
`

export const GET_COMPANY = gql`
  query company($id: ID!){
    company(id: $id){
      _id
      code
      name
      mobile
      address
    }
  }
`