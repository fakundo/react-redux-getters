import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createGettersStatusReducer } from '../src'
import * as reducers from './reducers'

export default () => {
  const logger = createLogger({ collapsed: true })
  const createReducer = () => combineReducers({
    ...reducers,
    getterStatuses: createGettersStatusReducer(),
  })

  const store = createStore(
    createReducer(),
    applyMiddleware(thunk, logger)
  )

  return store
}

