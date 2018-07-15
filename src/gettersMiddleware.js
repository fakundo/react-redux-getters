import { GETTER_FETCH_CALLBACK } from './actions'

export default ({ getState }) => next => (action) => {
  const { type, key, callback } = action
  if (type === GETTER_FETCH_CALLBACK) {
    const state = getState()
    const { getters } = state
    if (getters[key]) callback(state, getters[key])
    return action
  }
  return next(action)
}
