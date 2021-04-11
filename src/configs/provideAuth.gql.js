import { gql } from '@apollo/client';

export const GET_ME = gql`
  query ($idCompany: ID!){
    getMe {
      username
    }
    company (id: $idCompany){
      _id
      name
    }
  }
`