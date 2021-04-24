import { gql } from '@apollo/client';

export const GET_ALL = gql`
  query stocks {
    stocks {
      _id
      quantity
      stockModel {
        code
        name
        detail {
          realFactor
          unit
          costPrice
        }
      }
    }
  }
`