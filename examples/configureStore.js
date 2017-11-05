import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createReducer as createGettersReducer } from '../src'
import * as getters from './getters'
import * as reducers from './reducers'

export default () => {
  let store

  const logger = createLogger({ collapsed: true })
  const gettersReducer = createGettersReducer(() => store, getters)

  const createReducer = () => combineReducers({
    ...reducers,
    getters: gettersReducer
  })

  store = createStore(
    createReducer(),
    applyMiddleware(thunk, logger)
  )

  return store
}

