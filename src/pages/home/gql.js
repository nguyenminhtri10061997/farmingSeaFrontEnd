import { gql } from '@apollo/client';

export const GET_ALL = gql`
  query ($type: EnumTypeDocument, $startDate: Float, $endDate: Float, $idSourceCompany: ID) {
    documents (type: $type, idSourceCompany: $idSourceCompany, startDate: $startDate, endDate: $endDate){
      _id
      createdAt
      sTransactions {
        _id
        idStockModel
        count
        quantity
        salePrice
        costPrice
        stockModel {
          name
        }
      }
    }
  }
`