import { gql } from '@apollo/client';

export const GET_DEFAULT_COMPANY = gql`
  query company($id: ID!){
    company (id: $id){
      _id
      name
    }
  }
`