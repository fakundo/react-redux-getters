import isNil from 'lodash/isNil'
import { PENDING, SUCCEDED } from './statuses'
import createGetterState from './createGetterState'

let GETTER_INDEX = 0

const warn = (message) => {
  console.warn(`[react-redux-getters]: ${message}`) // eslint-disable-line
}

const createGetterStateDirty = (state, getterState) => {
  const newGetterState = createGetterState(getterState)
  state.getters[newGetterState.key] = newGetterState // eslint-disable-line
  return newGetterState
}

export default ({
  stateSelector = () => warn('Required property stateSelector not provided'),
  asyncFetcher = () => warn('Required property asyncFetcher not provided'),
  stateUpdater = () => warn('Required property stateUpdater not provided'),
  shouldFetch = isNil,
}) => {
  const index = (GETTER_INDEX += 1, GETTER_INDEX)
  return (state, props = {}) => {
    const key = JSON.stringify({ index, props })
    const stateData = stateSelector(state, props)
    const calculateShouldFetch = () => shouldFetch(stateData, state, props)
    const getterState = state.getters[key]

    // Create new state of getter
    if (!getterState) {
      return createGetterStateDirty(state, {
        key,
        props,
        stateData,
        asyncFetcher,
        stateUpdater,
        status: PENDING,
        shouldFetch: calculateShouldFetch(),
      })
    }

    // Extracted state data changed
    if (getterState.stateData !== stateData) {
      // Refetch when state data has been dropped
      if (getterState.status === SUCCEDED && calculateShouldFetch()) {
        return createGetterStateDirty(state, {
          ...getterState,
          stateData,
          status: PENDING,
          shouldFetch: true,
        })
      }

      // Successful fetch
      return createGetterStateDirty(state, {
        ...getterState,
        stateData,
        status: SUCCEDED,
      })
    }

    return getterState
  }
}
