import { gql } from '@apollo/client';

export const LOGIN = gql`
  query login($info: infoScalar) {
    login(info: $info)
  }
`