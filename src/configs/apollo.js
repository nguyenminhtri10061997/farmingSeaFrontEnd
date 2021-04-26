import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from 'apollo-utilities'

import { errorMiddleware } from './errorsMiddleware'

const domain = `${window.location.host}` // len sever can doi lai
// const domain = 'localhost:3001' // len sever can doi lai
const endPoint = process.env.END_POINT || 'graphql'
let tmp = domain.replace('http://' , '')
tmp = domain.replace('https://' , '')
if (tmp.includes(':')) {
  tmp = tmp.slice(0, tmp.indexOf(':'))
}
tmp = `${window.location.protocol}${tmp}`
const urn = `${tmp.substr(window.location.protocol.length)}${process.env.PORT_BACK_END ? `:${process.env.PORT_BACK_END}`: ''}/${endPoint}`

const httpLink = new HttpLink({
  uri: `${window.location.protocol}//${urn}`
})

const wsLink = new WebSocketLink({
  uri: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${urn}`,
  options: {
    reconnect: false,
    connectionParams: () => ({
      'access-token': window.localStorage.getItem('access-token') || ''
    })
  }
})

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'access-token': localStorage.getItem('access-token') || ''
  }
}))

const linkSplit = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const link = ApolloLink.from([errorMiddleware, linkSplit])

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache({
    addTypename: false
  })
})

export { client }
