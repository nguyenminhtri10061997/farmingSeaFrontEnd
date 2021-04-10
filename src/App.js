import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import 'antd/dist/antd.css'
import ProvideAuth from './configs/ProvideAuth'
import AppApolloProvider from '../src/configs/apolloProvider'
import AppRouter from './configs/appRouter'

export default React.memo(() => {
  return (
    <AppApolloProvider>
      <ProvideAuth>
        <Router>
          <AppRouter />
        </Router>
      </ProvideAuth>
    </AppApolloProvider>
  )
})
