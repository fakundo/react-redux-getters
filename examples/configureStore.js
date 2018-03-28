import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createGettersReducer, gettersMiddleware } from '../src'
import * as reducers from './reducers'

export default () => {
  const logger = createLogger({ collapsed: true })
  const createReducer = () => combineReducers({
    ...reducers,
    getters: createGettersReducer(),
  })

  const store = createStore(
    createReducer(),
    applyMiddleware(gettersMiddleware, thunk, logger),
  )

  return store
}

