import isNil from 'lodash/isNil'
import { DEFAULT } from './statuses'
import { isGetter, GETTER_FIELD } from './isGetter'

const requiredProperty = (property) => () => (
  console && console.warn(`[react-redux-getters]: Required property ${property}`) // eslint-disable-line
)

export const createGetter = ({
  stateSelector = requiredProperty('stateSelector'),
  asyncFetcher = requiredProperty('asyncFetcher'),
  stateUpdater = requiredProperty('stateUpdater'),
  shouldFetch = isNil,
}) => (state, props = {}) => {
  const stateData = stateSelector(state, props)

  if (isGetter(stateData) || !shouldFetch(stateData, state, props)) {
    return stateData
  }

  return {
    [GETTER_FIELD]: {
      stateSelector,
      asyncFetcher,
      stateUpdater,
      props,
      status: DEFAULT,
      error: null,
      result: null,
      key: null,
    },
  }
}
