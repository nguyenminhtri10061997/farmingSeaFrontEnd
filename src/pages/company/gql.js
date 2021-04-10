import { gql } from '@apollo/client';

export const GET_ALL = gql`
  query conpanies {
    conpanies {
      _id
      code
      name
      mobile
      address
    }
  }
`

export const CREATE_ONE = gql`
  mutation createCompany($info: infoScalar) {
    createCompany(info: $info) {
      _id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation updateCompany($id: ID!, $info: infoScalar) {
    updateCompany(id: $id, info: $info) {
      _id
    }
  }
`

export const DELETES = gql`
  mutation deleteCompanies($ids: [ID]!) {
    deleteCompanies(ids: $ids)
  }
`