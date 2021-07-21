import { connectAdvanced } from 'react-redux'
import find from 'lodash/find'
import isFunction from 'lodash/isFunction'
import mapValues from 'lodash/mapValues'
import uniqueId from 'lodash/uniqueId'
import isShallowEqual from 'shallowequal'
import { FAILED, DEFAULT, FETCHING } from './statuses'
import { getterFetchCallback } from './actions'
import { GetterComposition } from './composeGetters'
import { isGetter, GETTER_FIELD } from './isGetter'

const CAN_DISPATCH_FIELD = '__canDispatch'

const makePendingResult = () => ({
  isPending: true,
  isSucceded: false,
  isFailed: false,
})

const makeSuccededResult = (data) => ({
  data,
  isPending: false,
  isSucceded: true,
  isFailed: false,
})

const makeFailedResult = (error) => ({
  error,
  isPending: false,
  isSucceded: false,
  isFailed: true,
})

const processGetter = (state, dispatcher, getter) => {
  if (!isGetter(getter)) {
    return makeSuccededResult(getter)
  }

  const { dispatch, [CAN_DISPATCH_FIELD]: canDispatch } = dispatcher
  const {
    [GETTER_FIELD]: { status, stateUpdater, asyncFetcher, props, error, stateSelector },
  } = getter

  if (status === FAILED) {
    return makeFailedResult(error)
  }

  if (canDispatch && status === DEFAULT) {
    const updateState = (nextData, actualState) => {
      stateUpdater(nextData, dispatch, actualState, props)
    }

    const updateGetter = (nextGetterData, actualState) => {
      const { [GETTER_FIELD]: prevGetter } = getter
      const nextGetter = { [GETTER_FIELD]: { ...prevGetter, ...nextGetterData } }
      updateState(nextGetter, actualState)
    }

    const key = uniqueId('react-redux-getters-')
    updateGetter({ status: FETCHING, key }, state)

    const isFetching = (actualState) => {
      const stateData = stateSelector(actualState, props)
      return isGetter(stateData)
        && stateData[GETTER_FIELD].status === FETCHING
        && stateData[GETTER_FIELD].key === key
    }

    asyncFetcher(dispatch, state, props)
      .then((fetchResult) => (
        dispatch(getterFetchCallback((actualState) => {
          if (isFetching(actualState)) {
            updateState(fetchResult, actualState)
          }
        }))
      ))
      .catch((fetchError) => (
        dispatch(getterFetchCallback((actualState) => {
          if (isFetching(actualState)) {
            updateGetter({ status: FAILED, error: fetchError, key: null }, actualState)
          }
        }))
      ))
  }

  return makePendingResult()
}

const processGetterComposition = (state, dispatcher, composition) => {
  const { getters, composeData, calculated, calculatedResult } = composition

  // Return already calculated result
  if (calculated) {
    return calculatedResult
  }

  // Create process function
  const processGetterOrComposition = makeProcessGetterOrComposition(state, dispatcher) // eslint-disable-line

  // Process each getter in composition
  const results = getters.map(processGetterOrComposition)

  // Check if some of getters are pending
  const pendingResult = find(results, 'isPending')
  if (pendingResult) {
    composition.updateCalculatedResult(pendingResult)
    return pendingResult
  }

  // Check if some of getters are failed
  const failedResult = find(results, 'isFailed')
  if (failedResult) {
    composition.updateCalculatedResult(failedResult)
    return failedResult
  }

  // Store result of the composition here
  let composedData = null

  try {
    // Try to find new result of the composition
    composedData = composeData(...results.map((result) => result.data))
  } catch (compositionError) {
    // Error in composition function
    const failedCompositionResult = makeFailedResult(compositionError)
    composition.updateCalculatedResult(failedCompositionResult)
    return failedCompositionResult
  }

  // Return succeded result
  const succededResult = makeSuccededResult(composedData)
  composition.updateCalculatedResult(succededResult)
  return succededResult
}

const makeProcessGetterOrComposition = (state, dispatcher) => (
  (getter) => {
    const processFunc = getter instanceof GetterComposition
      ? processGetterComposition
      : processGetter
    return processFunc(state, dispatcher, getter)
  }
)

const makeDispatcher = (dispatch) => {
  const dispatcher = ({
    [CAN_DISPATCH_FIELD]: true,
    dispatch: (...args) => {
      dispatcher[CAN_DISPATCH_FIELD] = false
      return dispatch(...args)
    },
  })
  return dispatcher
}

const createSelectorFactory = (dispatch, { mapGettersToProps }) => {
  let realMapGettersToProps
  let ownProps
  let allProps
  let getters
  let result

  return (nextState, nextOwnProps) => {
    let nextGetters

    // Find real mapGettersToProps and save it in upper scope
    // Useful when you want to create component with own reselect selector
    if (realMapGettersToProps) {
      nextGetters = realMapGettersToProps(nextState, nextOwnProps)
    } else {
      nextGetters = mapGettersToProps(nextState, nextOwnProps)
      if (isFunction(nextGetters)) {
        realMapGettersToProps = nextGetters
        nextGetters = realMapGettersToProps(nextState, nextOwnProps)
      } else {
        realMapGettersToProps = mapGettersToProps
      }
    }

    const ownPropsChanged = !isShallowEqual(ownProps, nextOwnProps)
    const dispatcher = makeDispatcher(dispatch)
    const processGetterOrComposition = makeProcessGetterOrComposition(nextState, dispatcher)
    let resultChanged = false

    // Calculate new result
    result = mapValues(nextGetters, (getter, key) => {
      if (!getters || getter !== getters[key]) {
        const getterResult = processGetterOrComposition(getter)
        if (!result || !isShallowEqual(getterResult, result[key])) {
          resultChanged = true
          return getterResult
        }
      }
      return result[key]
    })

    // Memoize getters
    getters = nextGetters

    // Own props changed, memoize new own props
    if (ownPropsChanged) {
      ownProps = nextOwnProps
    }

    // Result or own props changed, memoize all props
    if (resultChanged || ownPropsChanged) {
      allProps = { ...ownProps, ...result }
    }

    return allProps
  }
}

export const connectGetters = (mapGettersToProps, options) => (
  connectAdvanced(createSelectorFactory, { ...options, mapGettersToProps })
)
