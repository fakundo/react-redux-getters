import { GETTER_FETCH_CALLBACK } from './actions'

export const gettersMiddleware = ({ getState }) => (next) => (action) => {
  const { type, callback } = action
  if (type === GETTER_FETCH_CALLBACK) {
    callback(getState())
    return null
  }
  return next(action)
}
