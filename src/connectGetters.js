import { connectAdvanced } from 'react-redux'
import find from 'lodash/find'
import some from 'lodash/some'
import size from 'lodash/size'
import mapValues from 'lodash/mapValues'
import isShallowEqual from 'shallowequal'
import { PENDING, SUCCEDED, FAILED } from './statuses'
import { updateGetterStatus } from './actions'
import composeGetters, { GetterComposition } from './composeGetters'

const processGetter = (dispatch, getter) => {
  const {
    key,
    data,
    props,
    error,
    status,
    shouldFetch,
    asyncFetcher,
    onSuccess,
    onFailure,
  } = getter

  // Should we fetch data
  if (!status && shouldFetch(data)) {
    // Fetch data
    asyncFetcher(dispatch, props)
      // Fetch succeded
      .then((fetchedData) => {
        onSuccess(dispatch, props, fetchedData)
        dispatch(updateGetterStatus(key, SUCCEDED))
      })
      // Fetch failed
      .catch((fetchError) => {
        onFailure(dispatch, props, fetchError)
        dispatch(updateGetterStatus(key, FAILED, fetchError))
      })
    // Update getter status
    dispatch(updateGetterStatus(key, PENDING))
  }

  // Specify statuses
  const isPending = !status || status === PENDING
  const isSucceded = status === SUCCEDED
  const isFailed = status === FAILED

  // Create result object
  return {
    data: isSucceded ? data : undefined,
    error: isFailed ? error : undefined,
    isPending,
    isSucceded,
    isFailed,
  }
}

const processGetterComposition = (dispatch, composition) => {
  const { getters, composeData } = composition

  // Process each getter in composition
  const results = getters.map(getter => (
    getter instanceof GetterComposition ?
      processGetterComposition(dispatch, getter) :
      processGetter(dispatch, getter)
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

const processMapGettersToProps = (dispatch, mapGettersToProps, state, ownProps) => {
  const getters = mapGettersToProps(state, ownProps)
  return mapValues(
    getters,
    getter => processGetterComposition(dispatch, composeGetters(getter, data => data))
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
      dispatch,
      mapGettersToProps,
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
      dispatch,
      mapGettersToProps,
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
