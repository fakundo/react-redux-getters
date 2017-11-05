import mapValues from 'lodash/mapValues'

export default (getStore, getters) => {
  const state = mapValues(getters, getter => (...args) => {
    const { dispatch } = getStore()
    return dispatch(getter(...args))
  })

  return () => state
}
