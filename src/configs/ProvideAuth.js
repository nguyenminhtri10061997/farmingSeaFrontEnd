import React, { useRef, useReducer, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { AppContext } from '../configs/appContext'
import { reducer } from '../commons/commonFunc'
import { GET_ME } from './provideAuth.gql'

export default (props) => {
  const [state, setState] = useReducer(reducer, {
    isAuth: true,
    currentUser: {}
  })
  const [
    getMe, 
    { data }
  ] = useLazyQuery(GET_ME)

  useEffect(() => {
    if (localStorage.getItem('access-token') !== null) {
      getMe()
    } else {
      setState({
        currentUser: {},
        isAuth: false
      })
    }
  }, [])
  useEffect(() => {
    if (localStorage.getItem('access-token') !== null) {
      if (data?.getMe) {
        setState({
          currentUser: data?.getMe,
          isAuth: true
        })
      } else if (data?.getMe !== undefined) {
        setState({
          currentUser: {},
          isAuth: false
        })
      }
    }
  }, [data?.getMe])

  const appRef = useRef({})

  const setAppRef = (key, values) => {
    setAppRef[key] = values
  }
  const deleteAppRef = (key) => {
    delete appRef[key]
  }
  const setAuth = (isAuth) => {
    setState({
      isAuth
    })
  }
  return (
    <AppContext.Provider
      value={{
        ...state,
        setAppRef,
        deleteAppRef,
        setAuth
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}