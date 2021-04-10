import React from 'react'
import { client } from './apollo'
import { ApolloProvider } from '@apollo/client'

export default ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}