import React, { useContext } from 'react'
import { AppContext } from './appContext'
import { Switch, Route, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { Spin } from 'antd'
import Login from '../pages/login'
import listRouter from './router'

const Layout = React.lazy(() => import('../pages/layout')) // Lazy-loaded

const objComponent = {}
const hashByKeyComponent = {}
listRouter.forEach(route => {
  objComponent[route.component] = React.lazy(() => import(`../pages/${route.component}`))
  hashByKeyComponent[route.component] = route
})
const AppRouter = React.memo((props) => {
  const appContext = useContext(AppContext)
  if (appContext?.isAuth) {
    return (
      <React.Suspense fallback={(
        <Spin style={{ position: 'fixed', top: '50%', left: '50%' }} tip='Loading...' />
      )}>
        <Layout {...props}>
          <Switch>
            {Object.keys(objComponent).map((key, idx) => (
              <Route
                key={idx}
                path={hashByKeyComponent[key].path}
                render={(routerProps) => {
                  const Component = objComponent[key]
                  return <Component {...routerProps} />
                }}
              />
            ))}
            <Route
              path='/'
              render={() => {
                return (
                  <Redirect to='/home' />
                )
              }}
            />
          </Switch>
        </Layout>
      </React.Suspense>
    )
  }
  return (
    <Switch>
      <Route
        exact
        path='/login'
        render={() => {
          return (
            <Login
              {...props}
            />
          )
        }}
      />
      <Route
        path='/'
        render={() => {
          return (
            <Redirect to='/login' />
          )
        }}
      />
    </Switch>
  )
})

export default withRouter(AppRouter)
