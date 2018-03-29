import { connectAdvanced } from 'react-redux'
import find from 'lodash/find'
import some from 'lodash/some'
import size from 'lodash/size'
import mapValues from 'lodash/mapValues'
import isShallowEqual from 'shallowequal'
import { PENDING, SUCCEDED, FAILED } from './statuses'
import { setStatusPending, setStatusSucceded, setStatusFailed } from './actions'
import composeGetters, { GetterComposition } from './composeGetters'

const processGetter = (getter, dispatch, state) => {
  const {
    key,
    data,
    props,
    additionalParams,
    error,
    status,
    shouldFetch,
    asyncFetcher,
    onSuccess,
    onFailure,
  } = getter

  // Should we fetch data
  const isShouldFetch = shouldFetch(data, state, props, ...additionalParams)

  // Start fetch
  if (!status && isShouldFetch) {
    // Update getter status
    dispatch(setStatusPending(key))
    // Fetch data
    asyncFetcher(dispatch, state, props, ...additionalParams)
      // Fetch succeded
      .then((fetchedData) => {
        // Update getter status
        dispatch(setStatusSucceded(key, (actualState) => {
          onSuccess(fetchedData, dispatch, actualState, props, ...additionalParams)
        }))
      })
      // Fetch failed
      .catch((fetchError) => {
        // Update getter status
        dispatch(setStatusFailed(key, fetchError, (actualState) => {
          onFailure(fetchError, dispatch, actualState, props, ...additionalParams)
        }))
      })
  }

  // Create result status
  let resultStatus = status
  if (!isShouldFetch) {
    resultStatus = SUCCEDED
  } else if (!status) {
    resultStatus = PENDING
  }

  // Specify statuses
  const isPending = resultStatus === PENDING
  const isSucceded = resultStatus === SUCCEDED
  const isFailed = resultStatus === FAILED

  // Create result object
  return {
    data: isSucceded ? data : undefined,
    error: isFailed ? error : undefined,
    isPending,
    isSucceded,
    isFailed,
  }
}

const processGetterComposition = (composition, dispatch, state) => {
  const { getters, composeData } = composition

  // Process each getter in composition
  const results = getters.map(getter => (
    getter instanceof GetterComposition ?
      processGetterComposition(getter, dispatch, state) :
      processGetter(getter, dispatch, state)
  ))

  // Check if some of getters is pending
  const firstPendingResult = find(results, 'isPending')
  if (firstPendingResult) {
    return firstPendingResult
  }

  // Check if some of getters is failed
  const firstFailedResult = find(results, 'isFailed')
  if (firstFailedResult) {
    return firstFailedResult
  }

  // Every getter is succeded so compose their data
  return {
    ...results[0],
    data: composeData(...results.map(result => result.data)),
  }
}

const processMapGettersToProps = (mapGettersToProps, dispatch, state, ownProps) => {
  const getters = mapGettersToProps(state, ownProps)
  return mapValues(
    getters,
    getter => processGetterComposition(composeGetters(getter, data => data), dispatch, state)
  )
}

const isResultChanged = (result, nextResult) => {
  // Compare objects length
  if (size(result) !== size(nextResult)) {
    return true
  }
  // Shallow equal each value
  return some(result, (value, key) => !isShallowEqual(value, nextResult[key]))
}

const createPureSelectorFactory = mapGettersToProps => (dispatch) => {
  let result = {}
  let ownProps = {}
  let props = {}

  return (nextState, nextOwnProps) => {
    const nextResult = processMapGettersToProps(
      mapGettersToProps,
      dispatch,
      nextState,
      nextOwnProps
    )

    const resultChanged = isResultChanged(result, nextResult)
    const ownPropsChanged = !isShallowEqual(ownProps, nextOwnProps)

    if (ownPropsChanged || resultChanged) {
      result = nextResult
      ownProps = nextOwnProps
      props = { ...nextResult, ...nextOwnProps }
    }

    return props
  }
}

const createImpureSelectorFactory = mapGettersToProps => (dispatch) => {
  return (nextState, nextOwnProps) => {
    return processMapGettersToProps(
      mapGettersToProps,
      dispatch,
      nextState,
      nextOwnProps
    )
  }
}

export default (mapGettersToProps, { pure = true, ...rest } = {}) => (
  pure ?
    connectAdvanced(createPureSelectorFactory(mapGettersToProps), rest) :
    connectAdvanced(createImpureSelectorFactory(mapGettersToProps), rest)
)
