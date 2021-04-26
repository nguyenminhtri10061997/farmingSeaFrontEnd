import React, { useRef, useReducer, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { AppContext } from '../configs/appContext'
import { reducer } from '../commons/commonFunc'
import { GET_ME } from './provideAuth.gql'

export default (props) => {
  const [state, setState] = useReducer(reducer, {
    isAuth: true,
    currentUser: {},
    sourceCompany: {}
  })
  const [
    getMe, 
    { data }
  ] = useLazyQuery(GET_ME, {
    variables: {
      idCompany: 'default'
    }
  })

  useEffect(() => {
    if (localStorage.getItem('access-token') !== null) {
      getMe()
    } else {
      setState({
        currentUser: {},
        sourceCompany: data?.company,
        isAuth: false
      })
    }
  }, [])
  useEffect(() => {
    if (localStorage.getItem('access-token') !== null) {
      if (data?.getMe) {
        setState({
          currentUser: data?.getMe,
          sourceCompany: data?.company,
          isAuth: true
        })
      } else if (data?.getMe !== undefined) {
        setState({
          currentUser: {},
          sourceCompany: data?.company,
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
  const setSrcCompany = (sourceCompany) => {
    setState({
      sourceCompany
    })
  }

  const getMeFunc = async () => {
    await getMe()
  }
  return (
    <AppContext.Provider
      value={{
        ...state,
        setAppRef,
        deleteAppRef,
        setAuth,
        setSrcCompany,
        getMeFunc
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}