import isNil from 'lodash/isNil'
import { DEFAULT } from './statuses'

const requiredProperty = property => (
  console && console.warn(`[react-redux-getters]: Required property ${property} not provided`) // eslint-disable-line
)

export default ({
  stateSelector = () => requiredProperty('stateSelector'),
  asyncFetcher = () => requiredProperty('asyncFetcher'),
  stateUpdater = () => requiredProperty('stateUpdater'),
  shouldFetch = isNil,
}) => (state, props = {}) => {
  const stateData = stateSelector(state, props)

  if (shouldFetch(stateData, state, props)) {
    return {
      _getter: {
        stateSelector,
        asyncFetcher,
        stateUpdater,
        props,
        error: null,
        result: null,
        status: DEFAULT,
      }
    }
  }

  return stateData
}
