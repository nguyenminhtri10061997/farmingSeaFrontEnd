import { onError } from 'apollo-link-error'
// import { useHistory } from 'react-router-dom'

const errorMiddleware = onError(({
  graphQLErrors,
  networkError,
  response,
}) => {
  if (graphQLErrors) {
    if (response) {
      // eslint-disable-next-line prefer-destructuring
      response.errors = graphQLErrors[0]
    }
    if (graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
      localStorage.removeItem('access-token')
      // const history = useHistory()
      // history.push('login')
      window.location.href = '/login'
      // process.env.APP_SERVICE ? history.push(`/${process.env.APP_SERVICE}/login`) : history.push('/clinic/login')
    }
  }
  if (networkError) {
    console.error(`[Network Error]: ${networkError}`)
  }
})

export { errorMiddleware }
